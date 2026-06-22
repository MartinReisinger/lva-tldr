# Frage 1

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface MyTest {}

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface ExpectException {
    Class<? extends Exception> exception();
}

public static void runTests(Class<?> testClass) throws Exception {
    Object test = testClass.getConstructor().newInstance();

    for (Method method : testClass.getDeclaredMethods()) {
        if (method.isAnnotationPresent(MyTest.class)
                && method.isAnnotationPresent(ExpectException.class)) {
            try {
                method.invoke(test);
            } catch (Exception exception) {
                Class<? extends Exception> expected = method
                        .getAnnotation(ExpectException.class)
                        .exception();
                if (exception.getCause().getClass().equals(expected)) {
                    testOK(method.getName());
                    continue;
                }
            }
            testFailed(method.getName());
        }
    }
}
```

Die zusätzlich benötigte Annotation für `testDivideZero` lautet:

```java
@ExpectException(exception = ArithmeticException.class)
```

Für den Zugriff auf das private Feld:

```java
stateField.setAccessible(true);
```

# Frage 2

```java
public FoodItem(String name, double kcalPer100Grams, int grams) {
    this.name = new SimpleStringProperty(name);
    this.kcalPer100Grams = new SimpleDoubleProperty(kcalPer100Grams);
    this.grams = new SimpleIntegerProperty(grams);
}
```

```java
private final ObservableList<FoodItem> items;

public FoodTrackerModel() {
    this.items = FXCollections.observableArrayList();
}
```

```java
gramsColumn.setCellValueFactory(
        new PropertyValueFactory<>("grams"));

gramsColumn.setCellFactory(TextFieldTableCell.forTableColumn(
        new StringConverter<Integer>() {
            @Override
            public String toString(Integer value) {
                return value.toString();
            }

            @Override
            public Integer fromString(String text) {
                try {
                    return Integer.valueOf(text);
                } catch (NumberFormatException exception) {
                    return null;
                }
            }
        }));
```

```java
FoodItem selectedItem = foodItemsTable
        .getSelectionModel()
        .getSelectedItem();
if (selectedItem != null) {
    model.removeFoodItem(selectedItem);
}
```

# Frage 3

```java
@Override
protected Double compute() {
    if (end - start < seqThreshold) {
        double sum = 0;
        for (int i = start; i < end; i++) {
            sum += data[i];
        }
        return sum;
    }

    int middle = start + (end - start) / 2;
    RecursiveSum left = new RecursiveSum(data, start, middle);
    RecursiveSum right = new RecursiveSum(data, middle, end);
    left.fork();
    double rightResult = right.compute();
    return left.join() + rightResult;
}
```

# Frage 4

Die fehlenden Anweisungen lauten in ihrer Reihenfolge:

```java
SelectionKey key = server.register(
        selector, SelectionKey.OP_ACCEPT);

int n = selector.select();

if (key.isAcceptable()) {
    ServerSocketChannel server =
            (ServerSocketChannel) key.channel();
    SocketChannel channel = server.accept();
    channel.configureBlocking(false);
    channel.register(selector, SelectionKey.OP_READ);

    buffer.clear();
    buffer.put("START".getBytes());
    buffer.flip();
    channel.write(buffer);
} else if (key.isReadable()) {
    SocketChannel channel =
            (SocketChannel) key.channel();
    buffer.clear();
    channel.read(buffer);
    buffer.flip();
    int count = buffer.getInt();
    System.out.println(count);
}
```

# Frage 5

```java
public final class RMIMessage implements Serializable {
    // Felder, Konstruktor und Methoden wie in der Angabe
}

public interface RMIMessageServer extends Remote {
    void submit(String user, String message) throws RemoteException;
    List<RMIMessage> getMessages() throws RemoteException;
}

public final class RMIMessageServerImpl
        extends UnicastRemoteObject
        implements RMIMessageServer {

    protected RMIMessageServerImpl() throws RemoteException {
        super();
    }

    public void submit(String user, String message) {
        synchronized (messages) {
            messages.add(new RMIMessage(user, message));
        }
    }

    public List<RMIMessage> getMessages() {
        synchronized (messages) {
            return new ArrayList<>(messages);
        }
    }
}
```

Client:

```java
Registry registry = LocateRegistry.getRegistry("localhost", 4321);
RMIMessageServer server = (RMIMessageServer) registry.lookup("rmiServer");
```

# Frage 6

```java
@XmlRootElement
public final class RestMessage {
    public RestMessage() {
        this("", "");
    }

    @XmlElement
    public String getUser() { return user; }

    @XmlElement
    public String getMessage() { return message; }

    public void setUser(String user) { this.user = user; }
    public void setMessage(String message) { this.message = message; }
}
```

```java
@POST
@Path("/submit")
@Produces(MediaType.TEXT_PLAIN)
public boolean submit(
        @QueryParam("user") String user,
        @QueryParam("message") String message) {
    synchronized (messages) {
        return messages.add(new RestMessage(user, message));
    }
}

@GET
@Path("/messages")
@Produces(MediaType.APPLICATION_XML)
public List<RestMessage> getMessages() {
    synchronized (messages) {
        return new ArrayList<>(messages);
    }
}
```

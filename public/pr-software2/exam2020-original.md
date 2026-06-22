# Frage 1

Als Tutor für Softwareentwicklung 1 wollen Sie sich selbst ein kleines Test-Framework schreiben, da Sie in der JUnit Übungsstunde nicht aufgepasst haben ;)

Um eine Klasse zu testen, wird eine zugehörige Testklasse erzeugt, deren Methoden mit `@MyTest` annotiert sein können. Zusätzlich soll eine Annotation `@ExpectException` definieren, welche Exception vom Test erwartet wird.

Eine API mit hilfreichen Methoden findet sich am Ende der Angabe.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(/* TODO */)
public @interface MyTest {}

@Retention(RetentionPolicy.RUNTIME)
@Target(/* TODO */)
public @interface ExpectException {
    public Class<? extends Exception> exception();
}
```

Der Test-Harness führt alle Methoden aus, die mit `@MyTest` annotiert sind. Vervollständigen Sie die fehlenden Codesnippets, um für Testmethoden, die mit `@ExpectException` und `@MyTest` annotiert sind, zu prüfen, ob die erwartete Exception auch geworfen wurde.

```java
public static void runTests(Class<?> testClass) throws Exception {
    Object test =
        /* TODO */;

    for (Method m :
        /* TODO */) {

        if (
            /* TODO */
        ) {

            try {
                /* TODO */
            } catch (Exception e) {
                Class<? extends Exception> expected =
                    /* TODO */;

                if (e.getCause().getClass().equals(expected)) {
                    testOK(m.getName());
                    continue;
                }
            }

            testFailed(m.getName());
        }
    }
}
```

Vervollständigen Sie folgende Testmethoden für einen simplen Taschenrechner:

```java
@MyTest

/* TODO */

public void testDivideZero() {
    Calculator calc = new Calculator();
    calc.divide(0); // should throw ArithmeticException
}

@MyTest
public void testNegativeAdd() {
    Calculator calc = new Calculator();
    calc.add(-1);

    // check if private field "state" holds value -1
    Field stateField =
        Calculator.class.getDeclaredField("state");

    /* TODO */

    int state = stateField.getInt(calc);
    if (state != -1) {
        throw new TestFailedException();
    }
}
```

API:

```java
public final class Class<T>
    public Constructor<T> getConstructor(Class<?>... parameterTypes)
    public Method[] getDeclaredMethods()
    public Method[] getMethods()
    public Field getDeclaredField(String name)
    public Field getField(String name)

public final class Constructor<T>
    public T newInstance(Object... initargs)

public final class Field
    public Object get(Object obj)
    public int getInt(Object obj)

public final class Method
    public <T extends Annotation> T getAnnotation(Class<T> annotationClass)
    public boolean isAnnotationPresent(Class<? extends Annotation> annotationClass)
    public Annotation[] getAnnotations()
    public Object invoke(Object obj, Object... args)

public enum ElementType
    ANNOTATION_TYPE, CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD,
    PACKAGE, PARAMETER, TYPE, TYPE_PARAMETER, TYPE_USE
```

# Frage 2

Um das Abnehmen zu erleichtern, implementieren Sie ein FoodTracking System mit grafischer Benutzeroberfläche mittels JavaFX.

Eine API mit hilfreichen Methoden findet sich am Ende der Angabe.

Vervollständigen Sie das zugehörige Datenmodell mittels observable Properties:

```java
public final class FoodItem {

    private final StringProperty name; // as String

    private final DoubleProperty kcalPer100Grams; // as double

    private final IntegerProperty grams; // as int

    public FoodItem(String name, double kcalPer100Grams, int grams) {
        /* TODO */
    }
}
```

```java
public final class FoodTrackerModel {

    private final /* TODO */ items;

    public FoodTrackerModel() {
        this.items =
            /* TODO */;
    }

    public boolean removeFoodItem(FoodItem item) { ... }
}
```

Die GUI stellt die Daten des Modells als Tabelle dar (Spalten für `name`, `kcal/100g`, `grams`), wobei alle Spalten editierbar sein sollen.

Vervollständigen Sie das Setup für die Spalte `gramsColumn`:

```java
private void setupGramsColumn() {

    // connect column "gramsColumn" to property "grams"

    /* TODO */

    // make column editable using StringConverter

    gramsColumn.setCellFactory(TextFieldTableCell.forTableColumn(

        /* TODO */ {

            @Override
            public String toString(Integer object) {

                /* TODO */

            }

            @Override
            public Integer fromString(String string) {
                try {

                    /* TODO */

                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }
    ));
}
```

Bei einem Button-Klick soll die aktuell markierte Zeile in der Tabelle gelöscht werden (und der zugehörige Eintrag im Modell):

```java
removeFoodItemButton.setOnAction(event -> {

    final FoodItem selectedItem =
        /* TODO */;

    if (selectedItem != null) {

        /* TODO */

    }
});
```

API:

```java
public class TableView<S>
    public SelectionModel<S> getSelectionModel()
    public FocusModel<S> getFocusModel()

public class SelectionModel<S>
    public int getSelectedIndex()
    public S getSelectedItem()
    public boolean isEmpty()

public class FXCollections
    public static<E> ObservableList<E> observableArrayList()

public class TableColumn<S, T>
    public void setCellFactory(
        Callback<TableColumn<S,T>, TableCell<S,T>> value)

    public void setCellValueFactory(
        Callback<TableColumn.CellDataFeatures<S,T>,
        ObservableValue<T>> value)

public class PropertyValueFactory<S, T>
    implements Callback<TableColumn.CellDataFeatures<S,T>,
    ObservableValue<T>>

    public PropertyValueFactory(String property)

    public ObservableValue<T>
    call(TableColumn.CellDataFeatures<S,T> param)

public abstract class StringConverter<T>
    public StringConverter()

    abstract String toString(T object)

    abstract T fromString(String string)
```


# Frage 3

## Aufgabe 3: RecursiveTasks

Gegeben ist ein (großes) Array von Double-Werten. Von den Werten im Array soll die Summe gebildet und dafür eine parallele Lösung auf der Basis von RecursiveTasks implementiert werden.

Die Klasse `RecursiveSum` wird mit dem Array mit den Werten und einem Index-Bereich `[start .. end)` initialisiert. Das `RecursiveSum`-Objekt soll die Summe in diesem Bereich berechnen.

Ist der Bereich kleiner als `seqThreshold`, wird die Summe sequentiell berechnet. Sonst wird der Bereich in zwei Teile geteilt, zwei RecursiveTasks für die zwei Bereiche abgespalten, diese zur Ausführung gebracht und bei Vorliegen der Ergebnisse aus diesen beiden Subtasks diese addiert und die Summe zurückgegeben.

Implementieren Sie die Methode `compute` der Klasse `RecursiveSum`.

```java
public class RecursiveSum extends RecursiveTask<Double> {

    final int seqThreshold = 20;

    double[] data;

    int start, end;

    RecursiveSum(double[] data, int start, int end) {
        this.data = data;
        this.start = start;
        this.end = end;
    }

    @Override
    protected Double compute() {

        // TODO: Implementierung von compute

    }
}
```

API

Folgend ist Teil der Methoden von `RecursiveTask` gegeben:

```java
public abstract class RecursiveTask<V> extends ForkJoinTask<V>

    protected abstract V compute();

    public boolean cancel(boolean mayInterruptIfRunning);

    public final ForkJoinTask<V> fork();

    public final V invoke();

    public final V get()
        throws InterruptedException, ExecutionException;

    public final V get(long timeout, TimeUnit unit);

    public final V join();

    public final boolean isDone();

    public final boolean isCancelled();

    ...
```


# Frage 4

Folgendes Programm realisiert einen Server für Clients, die Zählerwerte (`count`) schicken. Das Server-Programm verwendet Channels und einen Selector. Ergänzen Sie die fehlenden Anweisungen. Beachten Sie die Kommentare im Programm und die APIs, die nach dem Programm angegeben sind.

```java
public class CountServer {

    private ServerSocketChannel server = null;
    private volatile boolean terminateSelector;
    private Selector selector;
    private ByteBuffer buffer;
    private Thread selectorThread;

    public CountServer() throws Exception {
        try {
            buffer = ByteBuffer.allocate(128);
            selector = Selector.open();
            selectorThread = new Thread(new SelectorRunnable());
            selectorThread.start();

            server = ServerSocketChannel.open();
            server.socket().bind(new InetSocketAddress(7777));
            server.configureBlocking(false);

            SelectionKey key =
                /* TODO */; // register server

            selectorThread.join();

        } finally {
            try {
                selector.close();
                server.close();
            } catch (IOException e) {
            }
        }
    }

    private class SelectorRunnable implements Runnable {

        @Override
        public void run() {
            System.out.println("START Selector");

            while (!terminateSelector) {
                try {
                    int n =
                        /* TODO */; // react to events from registered channels

                    Set<SelectionKey> keys = selector.selectedKeys();
                    Iterator<SelectionKey> keyIt = keys.iterator();

                    while (keyIt.hasNext()) {
                        SelectionKey key = keyIt.next();

                        if (
                            /* TODO */
                        ) { // is accept event

                            ServerSocketChannel server =
                                (ServerSocketChannel) key.channel();

                            SocketChannel channel = server.accept();

                            /* TODO */; // configure channel non blocking

                            /* TODO */; // register channel for read events

                            /* TODO */; // prepare buffer for put

                            buffer.put("START".getBytes());

                            /* TODO */; // prepare buffer for write

                            /* TODO */; // write to channel from buffer

                        } else if (
                            /* TODO */
                        ) { // is read event

                            SocketChannel channel =
                                (SocketChannel) key.channel();

                            /* TODO */; // prepare buffer for read

                            /* TODO */; // read into buffer

                            /* TODO */; // prepare buffer for get

                            int count = buffer.getInt();

                            System.out.println(count);
                        }

                        keyIt.remove();
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void terminate() {
        this.terminateSelector = true;
    }
}
```

APIs

```java
public class ByteBuffer
    static ByteBuffer allocate(int capacity)
    public ByteBuffer flip()
    public ByteBuffer clear()
    public abstract byte get()
    public abstract int getInt()
    public ByteBuffer put(byte[] src)
    ...

public class Selector implements Closeable {
    public static Selector open() throws IOException
    public abstract int select() throws IOException
    public int select(long timeout) throws IOException
    public int selectNow() throws IOException
    ...

public abstract class SelectionKey
    public boolean isReadable()
    public boolean isAcceptable()
    public boolean isConnectable()
    public boolean isWritable()
    public SelectableChannel channel()
    ...

public class SocketChannel
    public static SocketChannel open() throws IOException
    public static SocketChannel open(SocketAddress remote) throws IOException
    public boolean connect(SocketAddress remote) throws IOException
    public int read(ByteBuffer dst) throws IOException
    public long read(ByteBuffer[] dsts, int offset, int length) throws IOException
    public int write(ByteBuffer src) throws IOException
    public long write(ByteBuffer[] srcs, int offset, int length) throws IOException
    public final SelectionKey register(Selector sel, int ops)
    public abstract SelectableChannel configureBlocking(boolean block) throws IOException
    ...

public abstract class SelectionKey
    public static final int OP_READ, OP_WRITE, OP_ACCEPT, OP_CONNECT
```

# Frage 5

Vervollständigen Sie die folgende Implementierung eines öffentlichen Chatsystems. Das Chatsystem besteht aus einem Server und einer Client-Anwendung, die über RMI miteinander verbunden sind.

## Serialisierbare Repräsentation einer Nachricht:

```java
public final class RMIMessage
        /* TODO */ {

    private static final long serialVersionUID = 42L;

    private final String user, message;

    public RMIMessage(String user, String message) {
        this.user = user;
        this.message = message;
    }

    public String getUser() {
        return user;
    }

    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s", user, message);
    }
}
```

## Kontrakt eines Servers für das Chatsystem:

```java
public interface RMIMessageServer
        /* TODO */ {

    void submit(String user, String message)
            /* TODO */;

    List<RMIMessage> getMessages()
            /* TODO */;
}
```

## Implementierung eines Servers für das Chatsystem:

```java
public final class RMIMessageServerImpl
        /* TODO */
        implements RMIMessageServer {

    private static final List<RMIMessage> messages =
            new ArrayList<>();

    protected RMIMessageServerImpl()
            /* TODO */ {
        super();
    }

    @Override
    public void submit(String user, String message) {
        assert user != null;
        assert message != null;

        /* TODO */ {
            messages.add(new RMIMessage(user, message));
        }
    }

    @Override
    public List<RMIMessage> getMessages() {
        /* TODO */ {
            return new ArrayList<>(messages);
        }
    }

    public static void main(String[] args)
            throws RemoteException, AlreadyBoundException {

        final Registry registry =
                LocateRegistry.createRegistry(4321);

        registry.bind(
                "rmiServer",
                new RMIMessageServerImpl());
    }
}
```

## Implementierung eines Clients für das Chatsystem:

```java
public final class RMIMessageClient {

    public static void main(String[] args)
            throws RemoteException, NotBoundException {

        final RMIMessageServer server;

        final Registry registry =
                /* TODO */("localhost", 4321); // get the registry

        server = (RMIMessageServer)
                /* TODO */("rmiServer"); // lookup the server object

        server.submit("newGuy", "Hi all! I'm the new guy :)");

        server.getMessages().forEach(m ->
                System.out.println(m));
    }
}
```

API:

```java
public class LocateRegistry {
    public static Registry createRegistry(int port)
    public static Registry getRegistry(String host, int port)
    ...
}

public class Registry {
    public void bind(String name, Remote object)
    public Remote lookup(String name)
    public void unbind(String name, Remote object)
    ...
}

public interface Remote { }

public class RemoteException extends java.io.IOException {
    ...
}

public interface Serializable { }

public class UnicastRemoteObject {
    public UnicastRemoteObject() throws RemoteException
    public static Remote exportObject(Remote object, int port)
    public static boolean unexportObject(Remote object, boolean force)
    ...
}
```

# Frage 6

Vervollständigen Sie die folgende Implementierung eines Servers für ein öffentliches Chatsystem. Der Server stellt eine REST-basierte Schnittstelle zur Verfügung, über die Clients Nachrichten versenden und Abfragen können.

## Zu XML Serialisierbare Repräsentation einer Nachricht:

```java
/* TODO */

public final class RestMessage {

    private String user, message;

    /* TODO */

    public RestMessage() {
        this("", "");
    }

    public RestMessage(String user, String message) {
        this.user = user;
        this.message = message;
    }

    /* TODO */

    public String getUser() {
        return user;
    }

    /* TODO */

    public String getMessage() {
        return message;
    }

    /* TODO */

    public void setUser(String user) {
        this.user = user;
    }

    /* TODO */

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s", user, message);
    }
}
```

## Implementierung eines Servers für die REST-Schnittstelle:

```java
@Path("/MessageService")
public final class RestMessageServlet {

    private static final List<RestMessage> messages =
            new ArrayList<>();

    /* TODO */

    @Path("/submit")
    @Produces(MediaType.TEXT_PLAIN)
    public boolean submit(
            /* TODO */ String user,
            String message) {

        synchronized (messages) {
            return messages.add(new RestMessage(user, message));
        }
    }

    /* TODO */

    @Path("/messages")
    @Produces(MediaType. /* TODO */ )
    public List<RestMessage> getMessages() {

        synchronized (messages) {
            return new ArrayList<>(messages);
        }
    }
}
```

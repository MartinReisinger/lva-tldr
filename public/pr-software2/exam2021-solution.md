# Frage 1

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface UseSerializer {
    Class<? extends CustomSerializer> value();
}
```

```java
private void writeFieldValue(Field field, Object object)
        throws ReflectiveOperationException {
    field.setAccessible(true);

    if (field.isAnnotationPresent(UseSerializer.class)) {
        UseSerializer annotation =
                field.getAnnotation(UseSerializer.class);
        Class<? extends CustomSerializer> serializerClass =
                annotation.value();
        CustomSerializer serializer = serializerClass
                .getConstructor()
                .newInstance();
        serializer.writeValue(field.get(object));
    } else if (field.getType().isPrimitive()) {
        System.out.println(String.valueOf(field.get(object)));
    } else if (field.get(object) == null) {
        System.out.println("null");
    } else {
        writeObject(field.get(object));
    }
}
```

# Frage 2

```java
private final StringProperty name;
private final DoubleProperty kcalPer100Grams;
private final IntegerProperty grams;
private final DoubleProperty totalKcal;
```

```java
private final ObservableList<FoodItem> items;

public FoodTrackerModel() {
    this.items = FXCollections.observableArrayList();
}
```

Binding der Gesamtkalorien:

```java
totalKcal.bind(
        grams.multiply(kcalPer100Grams).divide(100.0));
```

Tabellenspalte und Entfernen:

```java
gramsColumn.setCellValueFactory(
        new PropertyValueFactory<>("grams"));
gramsColumn.setCellFactory(
        TextFieldTableCell.forTableColumn(
                new IntegerStringConverter()));

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
protected int[] compute() {
    if (to - from < THRESHOLD) {
        return computeFreqSeq(text, from, to);
    }

    int middle = from + (to - from) / 2;
    CharFreqTask left = new CharFreqTask(text, from, middle);
    CharFreqTask right = new CharFreqTask(text, middle, to);

    left.fork();
    int[] rightResult = right.compute();
    int[] leftResult = left.join();

    for (int i = 0; i < leftResult.length; i++) {
        leftResult[i] += rightResult[i];
    }
    return leftResult;
}
```

# Frage 4

Serversteuerung:

```java
Socket clientSocket = server.accept();
new Thread(new ClientHandler(clientSocket)).start();

terminate = true;
server.close();
```

Kommunikationsablauf im `ClientHandler`:

```java
send(out, "HELO_FROM " + server);
msg = receive(in);
String clientName = msg.substring(6);
send(out, "OK " + clientName);

StringBuilder post = new StringBuilder();
msg = receive(in);
while (!msg.equals("END")) {
    post.append(msg).append("\r\n");
    msg = receive(in);
}

postIt(clientName, post.toString());
send(out, "BYE");
socket.close();
```

Hilfsmethoden:

```java
public static String receive(BufferedReader in) throws IOException {
    return in.readLine();
}

public static void send(PrintWriter out, String text) {
    out.println(text);
    out.flush();
}
```

# Frage 5

```java
public class WeatherEvent implements Serializable {
    // Felder, Konstruktor und Getter wie in der Angabe
}

public interface WeatherListener extends Remote {
    void onWeatherChanged(WeatherEvent event) throws RemoteException;
}

public interface WeatherStation extends Remote {
    void addWeatherListener(WeatherListener listener)
            throws RemoteException;
    void removeWeatherListener(WeatherListener listener)
            throws RemoteException;
}

public final class WeatherStationImpl
        extends UnicastRemoteObject
        implements WeatherStation {

    public WeatherStationImpl() throws RemoteException {
        listeners = new CopyOnWriteArrayList<>();
    }

    public void addWeatherListener(WeatherListener listener)
            throws RemoteException {
        listeners.add(listener);
    }

    public void removeWeatherListener(WeatherListener listener)
            throws RemoteException {
        listeners.remove(listener);
    }
}
```

Server und Client:

```java
Registry registry = LocateRegistry.createRegistry(
        RMIConstants.WEATHER_STATION_HOST_PORT);
registry.bind(
        RMIConstants.WEATHER_STATION_APPLICATION_NAME,
        weatherStation);

private static final class WeatherClientListener
        extends UnicastRemoteObject
        implements WeatherListener {
    public WeatherClientListener() throws RemoteException { }

    public void onWeatherChanged(WeatherEvent event)
            throws RemoteException {
        System.out.printf(
                "Current weather conditions: %.2f°C, %.2f%% humidity%n",
                event.getTemperature(),
                event.getHumidity());
    }
}

Registry registry = LocateRegistry.getRegistry(
        WEATHER_STATION_HOST_NAME,
        WEATHER_STATION_HOST_PORT);
WeatherStation weatherStation = (WeatherStation) registry.lookup(
        WEATHER_STATION_APPLICATION_NAME);
```

# Frage 6

Ein REST-Client muss nicht in Java implementiert sein. Er muss lediglich HTTP verwenden und die vereinbarten Repräsentationen verarbeiten können.

```java
@XmlRootElement
public class ExamResult {
    public ExamResult() {
        this(0, "", 0.0);
    }

    @XmlElement
    public void setMatNr(int matNr) {
        this.matNr = matNr;
    }

    @XmlElement
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    @XmlElement
    public void setPoints(double points) {
        this.points = points;
    }
}
```

```java
@GET
@Produces(MediaType.APPLICATION_XML)
@Path("/all")
public List<ExamResult> getAllResultsAsXML() {
    synchronized (results) {
        return new ArrayList<>(results);
    }
}

@GET
@Produces(MediaType.TEXT_PLAIN)
@Path("/{matNr}")
public String getSingleResultAsPlainText(
        @PathParam("matNr") int matNr) {
    synchronized (results) {
        return results.stream()
                .filter(result -> result.getMatNr() == matNr)
                .findFirst()
                .map(ExamResult::toString)
                .orElseThrow(() -> new NoSuchStudentException(matNr));
    }
}

@Provider
public static class NoSuchStudentExceptionMapper
        implements ExceptionMapper<NoSuchStudentException> {
    @Override
    public Response toResponse(NoSuchStudentException exception) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity(exception.getMessage())
                .build();
    }
}
```

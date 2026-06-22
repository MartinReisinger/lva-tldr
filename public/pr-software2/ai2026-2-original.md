# Frage 1 - Annotations

**2 Punkte**

Implementieren Sie eine `@Retry`-Annotation basierend auf der Verwendung im unten gegebenen Code.

Die Annotation soll über Reflection zur Laufzeit auslesbar sein und nur auf Methoden verwendet werden können. `attempts` gibt die maximale Anzahl an Versuchen an. `delayMillis` ist optional und hat den Standardwert `0`.

```java
class ImportService {

    @Retry(attempts = 3)
    public void importFile() { ... }

    @Retry(attempts = 5, delayMillis = 200)
    public void downloadFile() { ... }
}
```

Hilfreiche APIs:

```java
public enum ElementType {
    TYPE,
    FIELD,
    METHOD,
    PARAMETER,
    CONSTRUCTOR,
    ...
}

public enum RetentionPolicy {
    SOURCE,
    CLASS,
    RUNTIME
}
```

# Frage 2 - Reflection

**2 Punkte**

Welchen Text gibt das nachfolgende Programm auf die Konsole aus?

```java
interface Trainable { }

class Animal { }

class Dog extends Animal implements Trainable { }

class Main {

    public static void main(String[] args) {
        System.out.print(
                Animal.class.isAssignableFrom(Dog.class) + " ");

        System.out.print(
                Dog.class.isAssignableFrom(Animal.class) + " ");

        System.out.print(
                Dog.class.getSuperclass().getSimpleName() + " ");

        System.out.print(
                Dog.class.getInterfaces()[0].getSimpleName());
    }
}
```

# Frage 3 - JavaFX Properties und Bindings

**4 Punkte**

Implementieren Sie die Bindings an der TODO-Stelle in der unten gegebenen Klasse.

- Der Wert (`valueProperty`) des `ProgressBar progressBar` soll immer dem Wert des Sliders geteilt durch `100` entsprechen.
- Der Text (`textProperty`) des Labels soll den ganzzahligen Sliderwert mit einem Prozentzeichen anzeigen, beispielsweise `"37 %"`.
- Beide Anzeigen müssen sich automatisch aktualisieren, sobald der Slider bewegt wird.

```java
class ProgressController {

    @FXML
    public Slider slider;

    @FXML
    public ProgressBar progressBar;

    @FXML
    public Label label;

    @FXML
    public void initialize() {

        // TODO
    }
}
```

Hilfreiche APIs:

```java
public interface Property<T> {
    void bind(ObservableValue<? extends T> observable);
}

public abstract class DoubleExpression
        implements ObservableValue<Number> {

    public DoubleBinding divide(double other);
}

public abstract class StringBinding
        implements ObservableValue<String> {

    protected void bind(Observable... dependencies);
    protected abstract String computeValue();
}

public final class Math {
    public static long round(double value);
}
```

# Frage 4 - Parallele Ausführung

Aus Übung 4 zur parallelen Ausführung mit dem Fork/Join-Framework ist gegeben:

- das generische Interface `Problem`:

```java
public interface Problem<R, P extends Problem<R, P>> {
    boolean isSmall();
    List<P> split();
    R combine(List<R> results);
    R solveSequential();
}
```

- und eine generische Task-Implementierung:

```java
public class ProblemRecursiveTask<
        R,
        P extends Problem<R, P>>
        extends RecursiveTask<R> {

    private final P problem;

    public ProblemRecursiveTask(P problem) {
        this.problem = problem;
    }

    @Override
    protected R compute() {
        if (problem.isSmall()) {
            return problem.solveSequential();
        }

        List<ProblemRecursiveTask<R, P>> tasks =
                problem.split().stream()
                        .map(ProblemRecursiveTask<R, P>::new)
                        .toList();

        tasks.forEach(ProblemRecursiveTask::fork);

        List<R> results = tasks.stream()
                .map(ProblemRecursiveTask::join)
                .toList();

        return problem.combine(results);
    }
}
```

## 4.1 WordSetProblem

**5 Punkte**

Implementieren Sie eine Klasse `WordSetProblem`, die das Interface `Problem` implementiert.

Ein `WordSetProblem` bearbeitet den Bereich `[from, to)` einer `List<String>` von Textzeilen. Das Resultat ist eine `Set<String>` mit allen unterschiedlichen Wörtern in diesem Bereich.

- Wörter sind durch ein oder mehrere Nicht-Buchstaben getrennt.
- Groß- und Kleinschreibung wird nicht unterschieden.
- Leere Wörter werden ignoriert.
- Bei weniger als 10 Zeilen wird sequentiell gearbeitet.
- Sonst wird der Bereich in der Mitte in zwei Teilprobleme geteilt.
- `combine` vereinigt die Ergebnismengen aller Teilprobleme.

Schreiben Sie die vollständige Klasse mit den notwendigen Feldern, einem Konstruktor und allen Methoden des Interfaces.

Hilfreiche APIs:

```java
public final class String {
    public String[] split(String regex);
    public String toLowerCase();
    public boolean isEmpty();
}

public interface Set<E> extends Collection<E> {
    boolean add(E element);
    boolean addAll(Collection<? extends E> values);
}
```

# Frage 5 - NIO WatchService

Folgende Methode verarbeitet Dateiänderungen in einem bereits registrierten Verzeichnis. Ergänzen Sie die beiden TODO-Stellen. `analyze(file)` startet die Analyse einer Java-Datei; die Implementierung dieser Methode ist nicht relevant.

```java
public static void processNextEvents(
        WatchService watchService,
        ExecutorService pool)
        throws InterruptedException {

    WatchKey key = watchService.take();
    Path directory = (Path) key.watchable();

    for (WatchEvent<?> event : key.pollEvents()) {
        if (event.kind() == OVERFLOW) {
            continue;
        }

        WatchEvent<Path> pathEvent =
                (WatchEvent<Path>) event;

        // TODO 5.1:
        // Determine the complete path belonging to the event

        if ((event.kind() == ENTRY_CREATE
                || event.kind() == ENTRY_MODIFY)
                && file.toString().endsWith(".java")) {

            // TODO 5.2:
            // Run analyze(file) as a task in pool
        }
    }

    key.reset();
}
```

## 5.1 Vollständiger Pfad

**1 Punkt**

Ermitteln Sie aus `directory` und dem relativen Pfad des Events den vollständigen Pfad `file`.

## 5.2 Analyse-Task

**2 Punkte**

Starten Sie `analyze(file)` als Task im gegebenen `ExecutorService pool`.

## API-Auszug

```java
public interface WatchService {
    WatchKey take() throws InterruptedException;
}

public interface WatchKey {
    Object watchable();
    List<WatchEvent<?>> pollEvents();
    boolean reset();
}

public interface WatchEvent<T> {
    Kind<T> kind();
    T context();
}

public interface Path {
    Path resolve(Path other);
}

public interface ExecutorService {
    Future<?> submit(Runnable task);
}
```

# Frage 6 - Websockets

**4 Punkte**

Nehmen Sie an, die Record-Klasse `Score` sowie passende Klassen `ScoreDecoder` und `ScoreEncoder` sind bereits implementiert:

```java
public record Score(String player, int points) { }
```

Vervollständigen Sie die vier mit `TODO` markierten Stellen (`a` bis `d`) des Serverendpoints.

- Beim Verbindungsaufbau wird die Session zu den aktiven Sessions hinzugefügt. Der neu verbundene Client erhält
  außerdem alle zuletzt gespeicherten Spielstände.
- Bei einer eingehenden `Score`-Nachricht wird der zuletzt gespeicherte Spielstand dieses Spielers ersetzt.
- Der neue Spielstand wird an alle aktuell verbundenen Clients gesendet, einschließlich des Absenders.
- Beim Schließen wird die Session aus den aktiven Sessions entfernt. Die Spielstände bleiben gespeichert.
- Verwenden Sie typisierte Nachrichten und beachten Sie Encoder und Decoder.

```java
@ServerEndpoint(value = "/scores", /* TODO a */)
public class ScoreEndpoint {

    private static final Set<Session> sessions =
            /* assume a threadsafe set here */;

    private static final Map<String, Score> latestScores =
            /* assume a threadsafe map here */;

    @OnOpen
    public void onOpen(Session session) {
        // TODO b
    }

    @OnMessage
    public void onMessage(Score score) {
        // TODO c
    }

    @OnClose
    public void onClose(Session session) {
        // TODO d
    }
}
```

Hilfreiche APIs:

```java
public interface Session {
    RemoteEndpoint.Async getAsyncRemote();
}

public interface RemoteEndpoint.Async {
    Future<Void> sendObject(Object data);
}

public interface Map<K, V> {
    V put(K key, V value);
    Collection<V> values();
}
```

# Frage 7 - gRPC und Protocol Buffers

**4 Punkte**

Für einen Dateidienst sind folgende Nachrichtentypen gegeben:

```proto
syntax = "proto3";

option java_multiple_files = true;
option java_package = "at.jku.ssw.files";

message Empty {}

message FileName {
  string name = 1;
}

message FileChunk {
  bytes data = 1;
}

message UploadResult {
  string name = 1;
  int64 stored_bytes = 2;
}

message FileEvent {
  string name = 1;
}

service FileService {
  // TODOs der Teilaufgaben 7.a bis 7.d
}
```

Ergänzen Sie für jede Teilaufgabe die passende RPC-Deklaration im Service.

## 7.a ListFiles

**1 Punkt**

Der Client sendet eine leere Anfrage. Der Server liefert die Namen aller vorhandenen Dateien als Stream einzelner `FileName`-Nachrichten.

## 7.b Upload

**1 Punkt**

Der Client sendet einen Stream von `FileChunk`-Nachrichten. Nach Abschluss antwortet der Server genau einmal mit einem `UploadResult`.

## 7.c Download

**1 Punkt**

Der Client sendet einen `FileName`. Der Server liefert den Dateiinhalt als Stream von `FileChunk`-Nachrichten.

## 7.d Observe

**1 Punkt**

Client und Server tauschen jeweils Streams von `FileEvent`-Nachrichten aus.

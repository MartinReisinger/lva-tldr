# Frage 1 - Annotations

**2 Punkte**

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Retry {
    int attempts();
    long delayMillis() default 0;
}
```

# Frage 2 - Reflection

**2 Punkte**

```text
Animal Trainable Object true
```

Die direkte Oberklasse von `Dog` ist `Animal`; das erste direkt implementierte Interface ist `Trainable`. Die Oberklasse von `Animal` ist `Object`, und `Trainable` ist ein Interface.

# Frage 3 - JavaFX Properties und Bindings

**4 Punkte**

```java
@FXML
public void initialize() {
    progressBar.progressProperty().bind(
            slider.valueProperty().divide(100.0));

    label.textProperty().bind(new StringBinding() {
        {
            bind(slider.valueProperty());
        }

        @Override
        protected String computeValue() {
            return Math.round(slider.getValue()) + " %";
        }
    });
}
```

Eine Lösung mit `Bindings.createStringBinding(...)` und `slider.valueProperty()` als Abhängigkeit ist ebenfalls korrekt.

# Frage 4 - Parallele Ausführung

## 4.1 WordSetProblem

**5 Punkte**

```java
public final class WordSetProblem
        implements Problem<Set<String>, WordSetProblem> {

    private final List<String> lines;
    private final int from;
    private final int to;

    public WordSetProblem(
            List<String> lines,
            int from,
            int to) {
        this.lines = lines;
        this.from = from;
        this.to = to;
    }

    @Override
    public boolean isSmall() {
        return to - from < 10;
    }

    @Override
    public List<WordSetProblem> split() {
        int middle = from + (to - from) / 2;
        return List.of(
                new WordSetProblem(lines, from, middle),
                new WordSetProblem(lines, middle, to));
    }

    @Override
    public Set<String> solveSequential() {
        Set<String> words = new HashSet<>();

        for (int i = from; i < to; i++) {
            for (String word : lines.get(i).split("[^A-Za-z]+")) {
                if (!word.isEmpty()) {
                    words.add(word.toLowerCase());
                }
            }
        }

        return words;
    }

    @Override
    public Set<String> combine(List<Set<String>> results) {
        Set<String> combined = new HashSet<>();
        results.forEach(combined::addAll);
        return combined;
    }
}
```

# Frage 5 - NIO WatchService

## 5.1 Vollständiger Pfad

**1 Punkt**

```java
Path file = directory.resolve(pathEvent.context());
```

## 5.2 Analyse-Task

**2 Punkte**

```java
pool.submit(() -> analyze(file));
```

Damit lautet die vollständige Methode:

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
        Path file = directory.resolve(pathEvent.context());

        if ((event.kind() == ENTRY_CREATE
                || event.kind() == ENTRY_MODIFY)
                && file.toString().endsWith(".java")) {
            pool.submit(() -> analyze(file));
        }
    }

    key.reset();
}
```

# Frage 6 - Websockets

**4 Punkte**

```java
@ServerEndpoint(
        value = "/scores",
        encoders = ScoreEncoder.class,
        decoders = ScoreDecoder.class)
public class ScoreEndpoint {

    private static final Set<Session> sessions =
            ConcurrentHashMap.newKeySet();

    private static final Map<String, Score> latestScores =
            new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session) {
        sessions.add(session);
        latestScores.values().forEach(score ->
                session.getAsyncRemote().sendObject(score));
    }

    @OnMessage
    public void onMessage(Score score) {
        latestScores.put(score.player(), score);
        sessions.forEach(session ->
                session.getAsyncRemote().sendObject(score));
    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }
}
```

# Frage 7 - gRPC und Protocol Buffers

**4 Punkte**

```java
service FileService {
  rpc ListFiles(Empty) returns (stream FileName);
  rpc Upload(stream FileChunk) returns (UploadResult);
  rpc Download(FileName) returns (stream FileChunk);
  rpc Observe(stream FileEvent) returns (stream FileEvent);
}
```

## 7.a ListFiles

**1 Punkt**

```java
rpc ListFiles(Empty) returns (stream FileName);
```

## 7.b Upload

**1 Punkt**

```java
rpc Upload(stream FileChunk) returns (UploadResult);
```

## 7.c Download

**1 Punkt**

```java
rpc Download(FileName) returns (stream FileChunk);
```

## 7.d Observe

**1 Punkt**

```java
rpc Observe(stream FileEvent) returns (stream FileEvent);
```

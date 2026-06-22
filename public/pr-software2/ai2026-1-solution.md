# Frage 1 - Annotations

**2 Punkte**

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.PARAMETER})
public @interface Range {
    int min();
    int max() default Integer.MAX_VALUE;
}
```

# Frage 2 - Reflection

**2 Punkte**

```text
true StringBox Box 0
```

`StringBox[]` ist ein Array mit Komponententyp `StringBox`. Seine Oberklasse ist `Box`; `StringBox` deklariert selbst keine Typparameter.

# Frage 3 - JavaFX Properties und Bindings

**4 Punkte**

```java
@FXML
public void initialize() {
    BooleanBinding underage = Bindings.createBooleanBinding(
            () -> ageSpinner.getValue() < 18,
            ageSpinner.getValueFactory().valueProperty());

    BooleanBinding invalid =
            nameField.textProperty().isEmpty().or(underage);

    registerButton.disableProperty().bind(invalid);

    statusLabel.textProperty().bind(
            Bindings.when(invalid)
                    .then("not eligible")
                    .otherwise("ready"));
}
```

# Frage 4 - Parallele Ausführung

## 4.1 LongestLineProblem

**5 Punkte**

```java
public final class LongestLineProblem
        implements Problem<LineResult, LongestLineProblem> {

    private final List<String> lines;
    private final int from;
    private final int to;

    public LongestLineProblem(List<String> lines, int from, int to) {
        this.lines = lines;
        this.from = from;
        this.to = to;
    }

    @Override
    public boolean isSmall() {
        return to - from < 20;
    }

    @Override
    public List<LongestLineProblem> split() {
        int middle = from + (to - from) / 2;
        return List.of(
                new LongestLineProblem(lines, from, middle),
                new LongestLineProblem(lines, middle, to));
    }

    @Override
    public LineResult solveSequential() {
        LineResult best = new LineResult(from, lines.get(from).length());

        for (int i = from + 1; i < to; i++) {
            best = better(best, new LineResult(i, lines.get(i).length()));
        }
        return best;
    }

    @Override
    public LineResult combine(List<LineResult> results) {
        LineResult best = results.getFirst();
        for (int i = 1; i < results.size(); i++) {
            best = better(best, results.get(i));
        }
        return best;
    }

    private static LineResult better(LineResult a, LineResult b) {
        if (b.length() > a.length()
                || (b.length() == a.length() && b.index() < a.index())) {
            return b;
        }
        return a;
    }
}
```

# Frage 5 - Non-blocking Server mit Selector

## 5.1 Client registrieren

**1 Punkt**

```java
SelectionKey key = channel.register(
        selector, SelectionKey.OP_READ);
key.attach(state);
```

## 5.2 Client schließen

**2 Punkte**

```java
ClientState state = (ClientState) key.attachment();
SocketChannel channel = (SocketChannel) key.channel();

if (state.name() != null) {
    loggedInClients.remove(state.name());
}

channelKeys.remove(channel);
key.cancel();
channel.close();
```

# Frage 6 - Websockets

**4 Punkte**

```java
@ClientEndpoint(
        encoders = NotificationEncoder.class,
        decoders = NotificationDecoder.class)
public final class NotificationEndpoint {
    private final Consumer<Notification> listener;
    private Session session;

    public NotificationEndpoint(Consumer<Notification> listener) {
        this.listener = listener;
    }

    @OnOpen
    public void onOpen(Session session) {
        this.session = session;
    }

    @OnMessage
    public void onMessage(Notification notification) {
        listener.accept(notification);
    }

    public void send(Notification notification) {
        session.getAsyncRemote().sendObject(notification);
    }
}
```

# Frage 7 - Foreign Function & Memory

**4 Punkte**

## 7.a Speicher reservieren

**1 Punkt**

```java
MemorySegment text = arena.allocateFrom(input);
```

## 7.b Funktionsbeschreibung

**1 Punkt**

```java
FunctionDescriptor descriptor = FunctionDescriptor.of(
        ValueLayout.JAVA_LONG,
        ValueLayout.ADDRESS);
```

## 7.c Aufruf

**1 Punkt**

```java
MethodHandle handle = Linker.nativeLinker()
        .downcallHandle(function, descriptor);

long changed = (long) handle.invoke(text);
```

## 7.d Ergebnis lesen

**1 Punkt**

```java
String result = text.getString(0);
```

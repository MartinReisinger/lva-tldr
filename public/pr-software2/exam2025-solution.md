# Frage 1 – Annotations

**2 Punkte**

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.FIELD, ElementType.METHOD})
public @interface Docs {
    String name();
    String url();
}
```

# Frage 2 – Reflection

**2 Punkte**

```text
b d o p
```

`getFields()` liefert die öffentlichen Felder von `B` einschließlich geerbter Felder. `getDeclaredMethods()` liefert nur die direkt in `B` deklarierten Methoden unabhängig von ihrer Sichtbarkeit. Die Reihenfolge ist nicht festgelegt.

# Frage 3 – JavaFX Properties und Bindings

**4 Punkte**

```java
label.textProperty().bind(new StringBinding() {
    {
        bind(textArea.textProperty());
    }

    @Override
    protected String computeValue() {
        int count = 0;
        for (char character : textArea.getText().toCharArray()) {
            if (Character.isUpperCase(character)) {
                count++;
            }
        }
        return String.valueOf(count);
    }
});
```

# Frage 4 – Parallele Ausführung

**5 Punkte**

```java
public final class SumProblem
        implements Problem<Integer, SumProblem> {
    private final int[] values;
    private final int from;
    private final int to;

    public SumProblem(int[] values, int from, int to) {
        this.values = values;
        this.from = from;
        this.to = to;
    }

    @Override
    public boolean isSmall() {
        return to - from < 10;
    }

    @Override
    public Pair<SumProblem, SumProblem> split() {
        int middle = from + (to - from) / 2;
        return new Pair<>(
                new SumProblem(values, from, middle),
                new SumProblem(values, middle, to));
    }

    @Override
    public Integer combine(Integer first, Integer second) {
        return first + second;
    }

    @Override
    public Integer solveSequential() {
        int sum = 0;
        for (int i = from; i < to; i++) {
            sum += values[i];
        }
        return sum;
    }
}
```

# Frage 5 – Non-blocking Server mit Selector

## 5.1 Registrierung

**1 Punkt**

```java
clientChannel.register(selector, SelectionKey.OP_READ);
```

## 5.2 Lesen

**2 Punkte**

```java
buffer.clear();
channel.read(buffer);
buffer.flip();
```

# Frage 6 – Websockets

**4 Punkte**

```java
@ServerEndpoint(
        value = "/info",
        encoders = InfoEncoder.class,
        decoders = InfoDecoder.class)
public class BroadcastServerEndpoint {
    private static final Set<Session> activeClients =
            ConcurrentHashMap.newKeySet();

    @OnOpen
    public void onOpen(Session session) {
        activeClients.add(session);
    }

    @OnMessage
    public void onMessage(Session sender, Info info) {
        activeClients.stream()
                .filter(session -> !session.equals(sender))
                .forEach(session ->
                        session.getAsyncRemote().sendObject(info));
    }

    @OnClose
    public void onClose(Session session) {
        activeClients.remove(session);
    }
}
```

# Frage 7 – Foreign Function & Memory

**4 Punkte**

## 7.a)

**1 Punkt**

```c
double array_sum(const double *array, int length);
```

## 7.b)

**1 Punkt**

```java
MemorySegment nativeArray = offHeap.allocateFrom(
        ValueLayout.JAVA_DOUBLE,
        array);
```

## 7.c)

**1 Punkt**

```java
FunctionDescriptor sumDescriptor = FunctionDescriptor.of(
        ValueLayout.JAVA_DOUBLE,
        ValueLayout.ADDRESS,
        ValueLayout.JAVA_INT);
```

## 7.d)

**1 Punkt**

```java
double sum = (double) sumHandle.invoke(
        nativeArray,
        array.length);
```

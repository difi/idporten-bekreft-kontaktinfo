package no.digdir.kontaktinfo.config;

import org.slf4j.MDC;

import java.util.UUID;

/**
 * Stores correlation ID strings (UUID strings) for threads.
 */
public class CorrelationId {

    /**
     * Header name for correlation id
     */
    public static final String CORRELATION_ID_HEADER = "no.difi.correlationId";

    /**
     * The maximum length for a correlation id string
     */
    public static final int CORRELATION_ID_MAXLENGTH = 36;

    private static final String chop(String value, int length) {
        return value.length() <= length ? value : value.substring(0, length);
    }

    private static final ThreadLocal<String> correlationIdThreadLocal = new ThreadLocal() {

        /**
         * Generates UUID as default value.
         * @return uuid
         */
        @Override
        protected Object initialValue() {
            return UUID.randomUUID().toString();
        }
    };

    /**
     * Stores correlation id for current thread.  Generates if value is null.
     * @param value correlation id value
     */
    public static void set(String value) { // TODO: check me later
        correlationIdThreadLocal.set(value != null ? chop(value, CORRELATION_ID_MAXLENGTH) : get());
        MDC.put(CORRELATION_ID_HEADER, get());
    }

    /**
     * Gets correlation id for current thread.  Generates if not set.
     * @return
     */
    public static String get() {
        return correlationIdThreadLocal.get();
    }

    /**
     * Removes correlation id for current thread.
     */
    public static void remove() {
        correlationIdThreadLocal.remove();
        MDC.remove(CORRELATION_ID_HEADER);
    }

}

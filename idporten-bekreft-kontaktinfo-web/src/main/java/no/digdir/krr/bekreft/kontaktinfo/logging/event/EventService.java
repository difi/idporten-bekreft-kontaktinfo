package no.digdir.krr.bekreft.kontaktinfo.logging.event;

import no.idporten.domain.log.LogEntry;
import no.idporten.domain.log.LogEntryData;
import no.idporten.domain.log.LogEntryLogType;
import no.idporten.log.event.EventLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class EventService {

    private static final String ISSUER_MINID_ON_THE_FLY = "IDPORTEN-BEKREFT-KONTAKTINFO";

    static final LogEntryLogType IBK_USER_HAS_ARRIVED = new LogEntryLogType("IBK_USER_HAS_ARRIVED","User has arrived to idporten bekreft kontaktinfo");
    static final LogEntryLogType IBK_USER_NEEDS_TO_CONFIRM = new LogEntryLogType("IBK_USER_NEEDS_TO_CONFIRM","User asked to confirm kontaktinfo");
    static final LogEntryLogType IBK_USER_CONTINUE_TO_DESTINATION = new LogEntryLogType("IBK_USER_IS_FORWARDED","User has been forwarded");

    private EventLogger eventLogger;

    @Autowired
    public EventService(EventLogger eventLogger) {
        this.eventLogger = eventLogger;
    }

    public void logUserHasArrived(String personIdentifier){
        eventLogger.log(logEntry(IBK_USER_HAS_ARRIVED,personIdentifier));
    }

    public void logUserNeedsToConfirm(String personIdentifier){
        eventLogger.log(logEntry(IBK_USER_NEEDS_TO_CONFIRM,personIdentifier));
    }

    public void logUserContinueToDestination(String personIdentifier){
        eventLogger.log(logEntry(IBK_USER_CONTINUE_TO_DESTINATION,personIdentifier));
    }

    private LogEntry logEntry(LogEntryLogType logType, String personIdentifier, LogEntryData... logEntryData) {
        LogEntry logEntry = new LogEntry(logType);
        logEntry.setIssuer(ISSUER_MINID_ON_THE_FLY);
        logEntry.setPersonIdentifier(personIdentifier);
        logEntry.addAllLogEntryData(Arrays.asList(logEntryData));
        return logEntry;
    }

}

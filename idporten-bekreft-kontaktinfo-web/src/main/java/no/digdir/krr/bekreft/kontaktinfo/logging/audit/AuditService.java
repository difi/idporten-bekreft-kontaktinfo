package no.digdir.krr.bekreft.kontaktinfo.logging.audit;

import no.idporten.log.audit.AuditLogger;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

@Service
public class AuditService {
    private AuditLogger auditLogger;

    @Autowired
    public AuditService(AuditLogger auditLogger) {
        this.auditLogger = auditLogger;
    }

    protected String notApplicable() {
        return "n/a";
    }

    protected String notApplicable(String value) {
        return StringUtils.hasText(value) ? value : notApplicable();
    }

    public void auditContactInfoConfirm(String ssn, String email, String mobile) {
        auditLogger.log(
                AuditID.CONFIRM.auditId(),
                notApplicable(ssn),
                notApplicable(email),
                notApplicable(mobile)
        );
    }

    public void auditContactInfoUpdateEmail(String ssn, String oldValue, String newValue) {
        auditLogger.log(
                AuditID.UPDATE_EMAIL.auditId(),
                notApplicable(ssn),
                notApplicable(oldValue),
                notApplicable(newValue)
        );
    }

    public void auditContactInfoUpdateMobile(String ssn, String oldValue, String newValue) {
        auditLogger.log(
                AuditID.UPDATE_MOBILE.auditId(),
                notApplicable(ssn),
                notApplicable(oldValue),
                notApplicable(newValue)
        );
    }

    public void auditContactInfoCreate(String ssn, String email, String mobile) {
        auditLogger.log(
                AuditID.REGISTER.auditId(),
                notApplicable(ssn),
                notApplicable(email),
                notApplicable(mobile)
        );
    }
}

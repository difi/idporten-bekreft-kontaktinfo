package no.digdir.krr.bekreft.kontaktinfo.logging.audit;

public enum AuditID {

    CONFIRM(1,"CONFIRM"),
    UPDATE_EMAIL(2,"UPDATE-EMAIL"),
    UPDATE_MOBILE(3,"UPDATE-MOBILE"),
    REGISTER(4,"REGISTER");

    static final String AUDIT_ID_FORMAT ="IDPORTEN-BEKREFT-KONTAKTINFO-%d-%s";
    final String auditId;
    final int id;

    AuditID(int numericId, String stringId) {
        this.auditId = String.format(AUDIT_ID_FORMAT,numericId,stringId);
        this.id = numericId;
    }

    public int id() {
        return id;
    }

    public String auditId() {
        return auditId;
    }
}

package no.digdir.krr.bekreft.kontaktinfo.config;

import lombok.Data;
import no.idporten.log.audit.AuditLogger;
import no.idporten.log.audit.AuditLoggerELFImpl;
import no.idporten.log.elf.ELFWriter;
import no.idporten.log.elf.FileRollerDailyImpl;
import no.idporten.log.elf.WriterCreator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class AuditLoggerConfig {

    @Value("${log.auditlog.dir:#{null}}")
    private String logDir;

    @Value("${log.auditlog.file:#{null}}")
    private String logFile;

    @Bean
    public AuditLogger auditLogger() {

        ELFWriter elfWriter = new ELFWriter(
                new FileRollerDailyImpl(logDir, logFile),
                new WriterCreator()
        );
        AuditLoggerELFImpl logger = new AuditLoggerELFImpl();
        logger.setELFWriter(elfWriter);
        logger.setDataSeparator("|");
        return logger;
    }

}

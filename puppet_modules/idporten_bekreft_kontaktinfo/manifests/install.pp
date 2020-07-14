#install.pp
class idporten_bekreft_kontaktinfo::install inherits idporten_bekreft_kontaktinfo {

  user { $idporten_bekreft_kontaktinfo::service_name:
    ensure => present,
    shell  => '/sbin/nologin',
    home   => '/',
  }

  file { "${idporten_bekreft_kontaktinfo::config_dir}${idporten_bekreft_kontaktinfo::application}":
    ensure => 'directory',
    mode   => '0755',
    owner  => $idporten_bekreft_kontaktinfo::service_name,
    group  => $idporten_bekreft_kontaktinfo::service_name,
  } ->
  file { "${idporten_bekreft_kontaktinfo::log_root}${idporten_bekreft_kontaktinfo::application}":
    ensure => 'directory',
    mode   => '0755',
    owner  => $idporten_bekreft_kontaktinfo::service_name,
    group  => $idporten_bekreft_kontaktinfo::service_name,
  } ->
  file { "${idporten_bekreft_kontaktinfo::log_root}${idporten_bekreft_kontaktinfo::application}/audit":
    ensure => 'directory',
    mode   => '0755',
    owner  => $idporten_bekreft_kontaktinfo::service_name,
    group  => $idporten_bekreft_kontaktinfo::service_name,
  } ->
  file { "${idporten_bekreft_kontaktinfo::install_dir}${idporten_bekreft_kontaktinfo::application}":
    ensure => 'directory',
    mode   => '0644',
    owner  => $idporten_bekreft_kontaktinfo::service_name,
    group  => $idporten_bekreft_kontaktinfo::service_name,
  }

  difilib::spring_boot_logrotate { $idporten_bekreft_kontaktinfo::application:
    application => $idporten_bekreft_kontaktinfo::application,
  }

  if ($platform::install_cron_jobs) {
    $log_cleanup_command = "find ${idporten_bekreft_kontaktinfo::log_root}${idporten_bekreft_kontaktinfo::application}/ -type f -name \"*.gz\" -mtime +7 -exec rm -f {} \\;"
    $auditlog_cleanup_command = "find ${idporten_bekreft_kontaktinfo::log_root}${idporten_bekreft_kontaktinfo::application}/audit/ -type f -name \"*audit.log\" -mtime +7 -exec rm -f {} \\;"

    cron { "${idporten_bekreft_kontaktinfo::application}_log_cleanup":
      command => $log_cleanup_command,
      user    => 'root',
      hour    => '03',
      minute  => '00',
    } ->
      cron { "${idporten_bekreft_kontaktinfo::application}_log_cleanup_audit":
        command => $auditlog_cleanup_command,
        user    => 'root',
        hour    => '03',
        minute  => '05',
      }
  }

}

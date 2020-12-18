class idporten_bekreft_kontaktinfo (
  String $service_name                                 = $idporten_bekreft_kontaktinfo::params::service_name,
  String $install_dir                                  = $idporten_bekreft_kontaktinfo::params::install_dir,
  String $application                                  = $idporten_bekreft_kontaktinfo::params::application,
  String $log_root                                     = $idporten_bekreft_kontaktinfo::params::log_root,
  String $app_context_path                             = $idporten_bekreft_kontaktinfo::params::app_context_path,
  String $group_id                                     = $idporten_bekreft_kontaktinfo::params::group_id,
  String $artifact_id                                  = $idporten_bekreft_kontaktinfo::params::artifact_id,
  Integer $server_port                                 = $idporten_bekreft_kontaktinfo::params::server_port,
  String $keystore_type                                = $idporten_bekreft_kontaktinfo::params::keystore_type,
  String $keystore_location                            = $idporten_bekreft_kontaktinfo::params::keystore_location,
  String $keystore_password                            = $idporten_bekreft_kontaktinfo::params::keystore_password,
  String $keystore_key_alias                           = $idporten_bekreft_kontaktinfo::params::keystore_key_alias,
  String $keystore_key_password                        = $idporten_bekreft_kontaktinfo::params::keystore_key_password,
  String $krr_backend_url                              = $idporten_bekreft_kontaktinfo::params::krr_backend_url,
  Integer $krr_backend_read_timeout                    = $idporten_bekreft_kontaktinfo::params::krr_backend_read_timeout,
  Integer $krr_backend_connect_timeout                 = $idporten_bekreft_kontaktinfo::params::krr_backend_connect_timeout,
  Integer $krr_tip_days_user                           = $idporten_bekreft_kontaktinfo::params::krr_tip_days_user,
  String $tomcat_tmp_dir                               = $idporten_bekreft_kontaktinfo::params::tomcat_tmp_dir,
  String $health_show_details                          = $idporten_bekreft_kontaktinfo::params::health_show_details,
  Integer $cache_local_ttl_in_s                        = $idporten_bekreft_kontaktinfo::params::cache_local_ttl_in_s,
  Integer $cache_cluster_ttl_in_s                      = $idporten_bekreft_kontaktinfo::params::cache_cluster_ttl_in_s,
  Integer $par_lifetime_seconds                        = $idporten_bekreft_kontaktinfo::params::par_lifetime_seconds,
  Integer $authorization_lifetime_seconds              = $idporten_bekreft_kontaktinfo::params::authorization_lifetime_seconds,
  String $internal_id                                  = $idporten_bekreft_kontaktinfo::params::internal_id,
  String $issuer                                       = $idporten_bekreft_kontaktinfo::params::issuer,
  String $acr                                          = $idporten_bekreft_kontaktinfo::params::acr,
  String $locale                                       = $idporten_bekreft_kontaktinfo::params::locale,
  String $cache_transport_file_location                = $idporten_bekreft_kontaktinfo::params::cache_transport_file_location,
  Integer $cache_groups_udp_mcast_port                 = $idporten_bekreft_kontaktinfo::params::cache_groups_udp_mcast_port,
  String $cache_groups_udp_bind_addr                   = $idporten_bekreft_kontaktinfo::params::cache_groups_udp_bind_addr,
  Boolean $featureswitch_bekreft_kontaktinfo           = $idporten_bekreft_kontaktinfo::params::featureswitch_bekreft_kontaktinfo,
  String $contentSecurityPolicy_url                    = $idporten_bekreft_kontaktinfo::params::contentsecuritypolicy_url,
  String $eventlog_jms_queuename                       = $idporten_bekreft_kontaktinfo::params::eventlog_jms_queuename,
  String $eventlog_jms_url                             = $idporten_bekreft_kontaktinfo::params::eventlog_jms_url,
  String $auditlog_dir                                 = $idporten_bekreft_kontaktinfo::params::auditlog_dir,
  String $auditlog_file                                = $idporten_bekreft_kontaktinfo::params::auditlog_file

) inherits idporten_bekreft_kontaktinfo::params {

  include platform
  include difilib

  anchor { 'idporten_bekreft_kontaktinfo::begin': } ->
  class { '::idporten_bekreft_kontaktinfo::install': } ->
  class { '::idporten_bekreft_kontaktinfo::deploy': } ->
  class { '::idporten_bekreft_kontaktinfo::config': } ~>
  class { '::idporten_bekreft_kontaktinfo::test_setup': } ~>
  class { '::idporten_bekreft_kontaktinfo::service': } ->
  anchor { 'idporten_bekreft_kontaktinfo::end': }

}

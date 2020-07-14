class idporten_bekreft_kontaktinfo (
  String $service_name                                 = $idporten_bekreft_kontaktinfo::params::service_name,
  String $install_dir                                  = $idporten_bekreft_kontaktinfo::params::install_dir,
  String $application                                  = $idporten_bekreft_kontaktinfo::params::application,
  String $log_root                                     = $idporten_bekreft_kontaktinfo::params::log_root,
  String $app_root                                     = $idporten_bekreft_kontaktinfo::params::app_root,
  String $app_context_path                             = $idporten_bekreft_kontaktinfo::params::app_context_path,
  String $group_id                                     = $idporten_bekreft_kontaktinfo::params::group_id,
  String $artifact_id                                  = $idporten_bekreft_kontaktinfo::params::artifact_id,
  Integer $server_port                                 = $idporten_bekreft_kontaktinfo::params::server_port,

) inherits idporten_bekreft_kontaktinfo::params {

  include platform
  include difilib

  anchor { 'idporten_bekreft_kontaktinfo::begin': } ->
  class { '::idporten_bekreft_kontaktinfo::install': } ->
  class { '::idporten_bekreft_kontaktinfo::deploy': } ->
  class { '::idporten_bekreft_kontaktinfo::config': } ~>
  class { '::idporten_bekreft_kontaktinfo::service': } ->
  anchor { 'idporten_bekreft_kontaktinfo::end': }

}
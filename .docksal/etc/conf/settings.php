<?php

/**
 * @file
 * Local settings that are copied via fin init.
 */

// Docksal DB connection settings.
$databases['default']['default'] = [
  'database' => 'default',
  'username' => 'user',
  'password' => 'user',
  'host' => 'db',
  'driver' => 'mysql',
];

$settings['container_yamls'][] = DRUPAL_ROOT . '/sites/development.services.yml';

// Set Trusted Host Patterns to any.
$settings['trusted_host_patterns'][] = '.*';

// Skip file system permissions hardening.
$settings['skip_permissions_hardening'] = TRUE;

// Private filesystem
$settings['file_private_path'] = '../private';

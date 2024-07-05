#!/bin/bash

# .env should define the environment where this script should save the backup and where should it get the DB script from
set -a
[ -f .env ] && . .env
set +a

# Check if all the needed environment are here
if [ -z "$DB_HOST" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ] || [ -z "$BACKUP_DIR" ]; then
  echo "One or more needed environment aren't present. Guarantee that you have defined DB_HOST, DB_USER, DB_PASSWORD, DB_NAME e BACKUP_DIR."
  exit 1
fi

DATE=$(date +"%Y%m%d%H%M%S")
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$DATE.sql"

# If the directory doesn't exists, this command should create it, else will do nothing
mkdir -p $BACKUP_DIR

# backup command
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "Success backup: $BACKUP_FILE"
else
  echo "Backup failed"
fi

# User schema

# --- !Ups

create table "user" (
  uuid uuid primary key,
  oauth_id text not null
);

# --- !Downs

DROP TABLE "user";

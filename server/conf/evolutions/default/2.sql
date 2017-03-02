# User schema

# --- !Ups

alter table "user" ADD refresh_token text not null default '';

# --- !Downs

alter table "user" DROP refresh_token;

DROP TABLE "user";

CREATE TABLE "user" (
	"username" char(30) not null primary key,
	"password" char(30) not null
);

INSERT INTO "user" VALUES ('userfirst', 'fshfsjs');
INSERT INTO "user" VALUES ('usersecond', 'fshfsjsdfs');
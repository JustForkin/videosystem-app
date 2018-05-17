CREATE OR REPLACE FUNCTION "trace_dislikes_f"()
RETURNS TRIGGER AS
$$
BEGIN

  UPDATE "Videos"
  SET "dislikes" = "dislikes" + 1
  WHERE "Videos"."id" = NEW."id";

  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER "trace_dislikes"
AFTER INSERT
ON "DislikedVideos"
FOR EACH ROW
EXECUTE PROCEDURE "trace_dislikes_f"();

-- ////////////////////////////////////////

CREATE OR REPLACE FUNCTION "trace_dislikes_back_f"()
RETURNS TRIGGER AS
$$
BEGIN

  UPDATE "Videos"
  SET "dislikes" = "dislikes" - 1
  WHERE "Videos"."id" = OLD."id";

  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER "trace_dislikes_back"
AFTER DELETE
ON "DislikedVideos"
FOR EACH ROW
EXECUTE PROCEDURE "trace_dislikes_back_f"();

CREATE OR REPLACE FUNCTION "trace_likes_f"()
RETURNS TRIGGER AS
$$
BEGIN
 
  UPDATE "Videos"
  SET "likes" = "likes" + 1
  WHERE "Videos"."id" = NEW."id"; 
 
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER "trace_likes"
AFTER INSERT
ON "LikedVideos"
FOR EACH ROW
EXECUTE PROCEDURE "trace_likes_f"();
-- THE FUNCTION
-- Video Rating (VR) = Likes (L) - Dislikes (D)
-- N - Number of uploaded videos
-- Longetivity Coefficient (LC) = (1 + 2 + ... + N) / N = (1 + N) / 2,    N > 0
-- R-Index (RI) = (LC + AVG(VR)) / 2
CREATE OR REPLACE FUNCTION "user_popularity"("username_" character varying(255))
RETURNS DOUBLE PRECISION
AS $$

DECLARE
  "n" INT := 0;
  "lc" NUMERIC := 0;
  "avg_vr" NUMERIC := 0;

BEGIN
  IF EXISTS (SELECT "username" FROM "Users" WHERE "username" = "username_") THEN
  BEGIN
    -- N
    SELECT COUNT("id") INTO "n"
    FROM "Videos"
    WHERE "authorUsername" = "username_";

    IF "n" = 0 THEN RETURN 0; END IF;

    -- LC
    "lc" := (1 + "n") / 2.0;

    -- AVG(VR)
    SELECT AVG("likes" - "dislikes") INTO "avg_vr"
    FROM "Videos"
    WHERE "authorUsername" = "username_";

    -- R-Index (RESULT)
    RETURN ("lc" + "avg_vr") / 2.0;

  END;
  ELSE RAISE EXCEPTION 'User does not exist.';
  END IF;
END;
$$
LANGUAGE PLPGSQL;

-- USING
SELECT "user_popularity"('user3');

-- ///////////////////////////////////////////////////////////////////

CREATE OR REPLACE FUNCTION "user_popularity_search"("searchQuery" character varying(255))
RETURNS TABLE (
	"username" "Users"."username"%TYPE,
	"popularity" DOUBLE PRECISION,
	"firstname" "Users"."firstname"%TYPE,
	"lastname" "Users"."lastname"%TYPE,
	"birthday" "Users"."birthday"%TYPE,
	"gender" "Users"."gender"%TYPE,
	"about" "Users"."about"%TYPE,
	"registerDate" "Users"."registerDate"%TYPE,
	"isAdmin" "Users"."isAdmin"%TYPE
)
AS $$
BEGIN
  RETURN QUERY
  SELECT
	"Users"."username",
	"user_popularity"("Users"."username"),
	"Users"."firstname",
	"Users"."lastname",
	"Users"."birthday",
	"Users"."gender",
	"Users"."about",
	"Users"."registerDate",
	"Users"."isAdmin"
  FROM "Users"
  WHERE "Users"."username" ILIKE "searchQuery"
  ORDER BY 2 DESC;
END;
$$
LANGUAGE PLPGSQL;

-- using (all)
SELECT * FROM "user_popularity_search"('%%');
-- using (w/ searchQuery)
SELECT * FROM "user_popularity_search"('%use%');

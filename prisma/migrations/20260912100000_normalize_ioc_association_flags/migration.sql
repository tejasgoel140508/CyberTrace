-- Older local databases stored the association fields as text (the campaign
-- or malware name). The Prisma schema has always treated these fields as
-- booleans, so normalize legacy values before Prisma reads them.
ALTER TABLE "IOC"
  ALTER COLUMN "malwareAssociated" TYPE BOOLEAN
  USING CASE
    WHEN lower(trim("malwareAssociated"::text)) IN ('true', 't', '1', 'yes', 'y') THEN true
    WHEN trim("malwareAssociated"::text) = '' OR lower(trim("malwareAssociated"::text)) IN ('false', 'f', '0', 'no', 'n') THEN false
    ELSE true
  END,
  ALTER COLUMN "campaignAssociated" TYPE BOOLEAN
  USING CASE
    WHEN lower(trim("campaignAssociated"::text)) IN ('true', 't', '1', 'yes', 'y') THEN true
    WHEN trim("campaignAssociated"::text) = '' OR lower(trim("campaignAssociated"::text)) IN ('false', 'f', '0', 'no', 'n') THEN false
    ELSE true
  END;




SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."news_category" AS ENUM (
    'top',
    'world',
    'business',
    'finance',
    'tech',
    'sports',
    'lifestyle',
    'politics',
    'other'
);


ALTER TYPE "public"."news_category" OWNER TO "postgres";


CREATE TYPE "public"."news_region" AS ENUM (
    'china',
    'us',
    'asia',
    'europe',
    'middle_east',
    'global',
    'other'
);


ALTER TYPE "public"."news_region" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."email_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subscriber_id" "uuid" NOT NULL,
    "digest_id" "uuid" NOT NULL,
    "sent_at" timestamp without time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "status" "text" NOT NULL,
    "provider" "text",
    "provider_msg_id" "text",
    "error_msg" "text"
);


ALTER TABLE "public"."email_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."google_news_rss" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "topic" "text" NOT NULL,
    "language" "text" NOT NULL,
    "title" "text" NOT NULL,
    "source" "text" NOT NULL,
    "pub_date" timestamp without time zone NOT NULL,
    "guid" "text" NOT NULL,
    "link" "text",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."google_news_rss" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."news_items_en" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "source" "text",
    "category" "text",
    "guid" "text" NOT NULL,
    "google_link" "text",
    "pub_date" timestamp without time zone,
    "google_rss_description" "text"
);


ALTER TABLE "public"."news_items_en" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."news_items_zh" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category" "text",
    "title" "text" NOT NULL,
    "source" "text",
    "created_at" timestamp without time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "guid" "text" NOT NULL,
    "google_link" "text",
    "pub_date" timestamp without time zone,
    "google_rss_description" "text"
);


ALTER TABLE "public"."news_items_zh" OWNER TO "postgres";


COMMENT ON TABLE "public"."news_items_zh" IS 'news_items in chinese';



CREATE TABLE IF NOT EXISTS "public"."subscribers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp without time zone DEFAULT ("now"() AT TIME ZONE 'utc'::"text") NOT NULL,
    "unsubscribed_at" timestamp without time zone,
    "preferred_regions" "public"."news_region"[] DEFAULT '{}'::"public"."news_region"[] NOT NULL,
    "preferred_categories" "public"."news_category"[] DEFAULT '{}'::"public"."news_category"[] NOT NULL
);


ALTER TABLE "public"."subscribers" OWNER TO "postgres";


ALTER TABLE ONLY "public"."email_logs"
    ADD CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."google_news_rss"
    ADD CONSTRAINT "google_news_rss_guid_key" UNIQUE ("guid");



ALTER TABLE ONLY "public"."google_news_rss"
    ADD CONSTRAINT "google_news_rss_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news_items_en"
    ADD CONSTRAINT "news_items_en_title_key" UNIQUE ("title");



ALTER TABLE ONLY "public"."news_items_en"
    ADD CONSTRAINT "news_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news_items_zh"
    ADD CONSTRAINT "news_items_zh_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."news_items_zh"
    ADD CONSTRAINT "news_items_zh_title_key" UNIQUE ("title");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id");



CREATE INDEX "email_logs_digest_id_idx" ON "public"."email_logs" USING "btree" ("digest_id");



CREATE INDEX "email_logs_sent_at_idx" ON "public"."email_logs" USING "btree" ("sent_at");



CREATE INDEX "email_logs_subscriber_id_idx" ON "public"."email_logs" USING "btree" ("subscriber_id");



CREATE INDEX "news_items_en_category_idx" ON "public"."news_items_en" USING "btree" ("category");



CREATE INDEX "news_items_en_pub_date_idx" ON "public"."news_items_en" USING "btree" ("pub_date");



CREATE INDEX "news_items_zh_category_idx" ON "public"."news_items_zh" USING "btree" ("category");



CREATE INDEX "news_items_zh_pub_date_idx" ON "public"."news_items_zh" USING "btree" ("pub_date");



ALTER TABLE ONLY "public"."email_logs"
    ADD CONSTRAINT "email_logs_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."subscribers"("id") ON DELETE CASCADE;



ALTER TABLE "public"."email_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."google_news_rss" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."news_items_en" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."news_items_zh" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "public_read_only_on_news_items_en" ON "public"."news_items_en" FOR SELECT TO "anon" USING (true);



CREATE POLICY "public_read_only_on_news_items_zh" ON "public"."news_items_zh" FOR SELECT TO "anon" USING (true);



ALTER TABLE "public"."subscribers" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."email_logs" TO "anon";
GRANT ALL ON TABLE "public"."email_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."email_logs" TO "service_role";



GRANT ALL ON TABLE "public"."google_news_rss" TO "anon";
GRANT ALL ON TABLE "public"."google_news_rss" TO "authenticated";
GRANT ALL ON TABLE "public"."google_news_rss" TO "service_role";



GRANT ALL ON TABLE "public"."news_items_en" TO "anon";
GRANT ALL ON TABLE "public"."news_items_en" TO "authenticated";
GRANT ALL ON TABLE "public"."news_items_en" TO "service_role";



GRANT ALL ON TABLE "public"."news_items_zh" TO "anon";
GRANT ALL ON TABLE "public"."news_items_zh" TO "authenticated";
GRANT ALL ON TABLE "public"."news_items_zh" TO "service_role";



GRANT ALL ON TABLE "public"."subscribers" TO "anon";
GRANT ALL ON TABLE "public"."subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."subscribers" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
































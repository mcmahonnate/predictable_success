--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

CREATE USER scoutmap WITH PASSWORD 'scoutmap';
GRANT ALL PRIVILEGES ON DATABASE scoutmap TO scoutmap;

--
-- Name: demo; Type: SCHEMA; Schema: -; Owner: scoutmap
--
CREATE SCHEMA demo;


ALTER SCHEMA demo OWNER TO scoutmap;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = demo, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: assessment_assessmentband; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_assessmentband (
    id integer NOT NULL,
    category_id integer NOT NULL,
    min_value integer NOT NULL,
    max_value integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL
);


ALTER TABLE demo.assessment_assessmentband OWNER TO scoutmap;

--
-- Name: assessment_assessmentband_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_assessmentband_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_assessmentband_id_seq OWNER TO scoutmap;

--
-- Name: assessment_assessmentband_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_assessmentband_id_seq OWNED BY assessment_assessmentband.id;


--
-- Name: assessment_assessmentcategory; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_assessmentcategory (
    id integer NOT NULL,
    assessment_id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE demo.assessment_assessmentcategory OWNER TO scoutmap;

--
-- Name: assessment_assessmentcategory_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_assessmentcategory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_assessmentcategory_id_seq OWNER TO scoutmap;

--
-- Name: assessment_assessmentcategory_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_assessmentcategory_id_seq OWNED BY assessment_assessmentcategory.id;


--
-- Name: assessment_assessmentcomparison; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_assessmentcomparison (
    id integer NOT NULL,
    this_id integer NOT NULL,
    that_id integer NOT NULL,
    assessed_date date NOT NULL,
    description text NOT NULL
);


ALTER TABLE demo.assessment_assessmentcomparison OWNER TO scoutmap;

--
-- Name: assessment_assessmentcomparison_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_assessmentcomparison_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_assessmentcomparison_id_seq OWNER TO scoutmap;

--
-- Name: assessment_assessmentcomparison_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_assessmentcomparison_id_seq OWNED BY assessment_assessmentcomparison.id;


--
-- Name: assessment_assessmenttype; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_assessmenttype (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE demo.assessment_assessmenttype OWNER TO scoutmap;

--
-- Name: assessment_assessmenttype_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_assessmenttype_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_assessmenttype_id_seq OWNER TO scoutmap;

--
-- Name: assessment_assessmenttype_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_assessmenttype_id_seq OWNED BY assessment_assessmenttype.id;


--
-- Name: assessment_employeeassessment; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_employeeassessment (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    category_id integer NOT NULL,
    score integer NOT NULL
);


ALTER TABLE demo.assessment_employeeassessment OWNER TO scoutmap;

--
-- Name: assessment_employeeassessment_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_employeeassessment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_employeeassessment_id_seq OWNER TO scoutmap;

--
-- Name: assessment_employeeassessment_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_employeeassessment_id_seq OWNED BY assessment_employeeassessment.id;


--
-- Name: assessment_mbti; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_mbti (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    type character varying(4) NOT NULL
);


ALTER TABLE demo.assessment_mbti OWNER TO scoutmap;

--
-- Name: assessment_mbti_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_mbti_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_mbti_id_seq OWNER TO scoutmap;

--
-- Name: assessment_mbti_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_mbti_id_seq OWNED BY assessment_mbti.id;


--
-- Name: assessment_mbtiemployeedescription; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_mbtiemployeedescription (
    id integer NOT NULL,
    type character varying(4) NOT NULL,
    description text NOT NULL
);


ALTER TABLE demo.assessment_mbtiemployeedescription OWNER TO scoutmap;

--
-- Name: assessment_mbtiemployeedescription_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_mbtiemployeedescription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_mbtiemployeedescription_id_seq OWNER TO scoutmap;

--
-- Name: assessment_mbtiemployeedescription_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_mbtiemployeedescription_id_seq OWNED BY assessment_mbtiemployeedescription.id;


--
-- Name: assessment_mbtiteamdescription; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_mbtiteamdescription (
    id integer NOT NULL,
    type character varying(4) NOT NULL,
    description text NOT NULL
);


ALTER TABLE demo.assessment_mbtiteamdescription OWNER TO scoutmap;

--
-- Name: assessment_mbtiteamdescription_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_mbtiteamdescription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_mbtiteamdescription_id_seq OWNER TO scoutmap;

--
-- Name: assessment_mbtiteamdescription_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_mbtiteamdescription_id_seq OWNED BY assessment_mbtiteamdescription.id;


--
-- Name: assessment_teamassessmentcluster; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_teamassessmentcluster (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL
);


ALTER TABLE demo.assessment_teamassessmentcluster OWNER TO scoutmap;

--
-- Name: assessment_teamassessmentcluster_bands; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE assessment_teamassessmentcluster_bands (
    id integer NOT NULL,
    teamassessmentcluster_id integer NOT NULL,
    assessmentband_id integer NOT NULL
);


ALTER TABLE demo.assessment_teamassessmentcluster_bands OWNER TO scoutmap;

--
-- Name: assessment_teamassessmentcluster_bands_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_teamassessmentcluster_bands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_teamassessmentcluster_bands_id_seq OWNER TO scoutmap;

--
-- Name: assessment_teamassessmentcluster_bands_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_teamassessmentcluster_bands_id_seq OWNED BY assessment_teamassessmentcluster_bands.id;


--
-- Name: assessment_teamassessmentcluster_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE assessment_teamassessmentcluster_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.assessment_teamassessmentcluster_id_seq OWNER TO scoutmap;

--
-- Name: assessment_teamassessmentcluster_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE assessment_teamassessmentcluster_id_seq OWNED BY assessment_teamassessmentcluster.id;


--
-- Name: auth_group; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_group (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE demo.auth_group OWNER TO scoutmap;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.auth_group_id_seq OWNER TO scoutmap;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE auth_group_id_seq OWNED BY auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE demo.auth_group_permissions OWNER TO scoutmap;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.auth_group_permissions_id_seq OWNER TO scoutmap;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE auth_group_permissions_id_seq OWNED BY auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_permission (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE demo.auth_permission OWNER TO scoutmap;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.auth_permission_id_seq OWNER TO scoutmap;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE auth_permission_id_seq OWNED BY auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone NOT NULL,
    is_superuser boolean NOT NULL,
    username character varying(30) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(30) NOT NULL,
    email character varying(75) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE demo.auth_user OWNER TO scoutmap;

--
-- Name: auth_user_groups; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE demo.auth_user_groups OWNER TO scoutmap;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.auth_user_groups_id_seq OWNER TO scoutmap;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE auth_user_groups_id_seq OWNED BY auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.auth_user_id_seq OWNER TO scoutmap;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE auth_user_id_seq OWNED BY auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE demo.auth_user_user_permissions OWNER TO scoutmap;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.auth_user_user_permissions_id_seq OWNER TO scoutmap;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE auth_user_user_permissions_id_seq OWNED BY auth_user_user_permissions.id;


--
-- Name: blah_comment; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE blah_comment (
    id integer NOT NULL,
    content_type_id integer NOT NULL,
    object_id integer NOT NULL,
    owner_content_type_id integer,
    owner_id integer,
    content text NOT NULL,
    created_date timestamp with time zone NOT NULL,
    modified_date timestamp with time zone NOT NULL,
    visibility integer NOT NULL,
    CONSTRAINT blah_comment_object_id_check CHECK ((object_id >= 0)),
    CONSTRAINT blah_comment_owner_id_check CHECK ((owner_id >= 0))
);


ALTER TABLE demo.blah_comment OWNER TO scoutmap;

--
-- Name: blah_comment_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE blah_comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.blah_comment_id_seq OWNER TO scoutmap;

--
-- Name: blah_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE blah_comment_id_seq OWNED BY blah_comment.id;


--
-- Name: comp_compensationsummary; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE comp_compensationsummary (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    year integer NOT NULL,
    fiscal_year integer NOT NULL,
    salary numeric(12,2) NOT NULL,
    bonus numeric(12,2) NOT NULL,
    discretionary numeric(12,2) NOT NULL,
    writer_payments_and_royalties numeric(12,2) NOT NULL
);


ALTER TABLE demo.comp_compensationsummary OWNER TO scoutmap;

--
-- Name: comp_compensationsummary_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE comp_compensationsummary_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.comp_compensationsummary_id_seq OWNER TO scoutmap;

--
-- Name: comp_compensationsummary_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE comp_compensationsummary_id_seq OWNED BY comp_compensationsummary.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    content_type_id integer,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE demo.django_admin_log OWNER TO scoutmap;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.django_admin_log_id_seq OWNER TO scoutmap;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE django_admin_log_id_seq OWNED BY django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_content_type (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE demo.django_content_type OWNER TO scoutmap;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.django_content_type_id_seq OWNER TO scoutmap;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE django_content_type_id_seq OWNED BY django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE demo.django_migrations OWNER TO scoutmap;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.django_migrations_id_seq OWNER TO scoutmap;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE django_migrations_id_seq OWNED BY django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE demo.django_session OWNER TO scoutmap;

--
-- Name: django_site; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_site (
    id integer NOT NULL,
    domain character varying(100) NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE demo.django_site OWNER TO scoutmap;

--
-- Name: django_site_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE django_site_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.django_site_id_seq OWNER TO scoutmap;

--
-- Name: django_site_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE django_site_id_seq OWNED BY django_site.id;


--
-- Name: engagement_happiness; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE engagement_happiness (
    id integer NOT NULL,
    assessed_by_id integer NOT NULL,
    assessed_date date NOT NULL,
    employee_id integer NOT NULL,
    assessment integer NOT NULL,
    comment_id integer
);


ALTER TABLE demo.engagement_happiness OWNER TO scoutmap;

--
-- Name: engagement_happiness_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE engagement_happiness_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.engagement_happiness_id_seq OWNER TO scoutmap;

--
-- Name: engagement_happiness_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE engagement_happiness_id_seq OWNED BY engagement_happiness.id;


--
-- Name: engagement_surveyurl; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE engagement_surveyurl (
    id integer NOT NULL,
    url character varying(255),
    active boolean NOT NULL,
    sent_date date NOT NULL,
    sent_to_id integer NOT NULL,
    completed boolean NOT NULL,
    sent_from_id integer
);


ALTER TABLE demo.engagement_surveyurl OWNER TO scoutmap;

--
-- Name: engagement_surveyurl_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE engagement_surveyurl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.engagement_surveyurl_id_seq OWNER TO scoutmap;

--
-- Name: engagement_surveyurl_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE engagement_surveyurl_id_seq OWNED BY engagement_surveyurl.id;


--
-- Name: feedback_feedbackrequest; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE feedback_feedbackrequest (
    id integer NOT NULL,
    request_date timestamp with time zone NOT NULL,
    expiration_date date,
    message text NOT NULL,
    is_complete boolean NOT NULL,
    requester_id integer NOT NULL,
    reviewer_id integer NOT NULL,
    was_declined boolean NOT NULL
);


ALTER TABLE demo.feedback_feedbackrequest OWNER TO scoutmap;

--
-- Name: feedback_feedbackrequest_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE feedback_feedbackrequest_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.feedback_feedbackrequest_id_seq OWNER TO scoutmap;

--
-- Name: feedback_feedbackrequest_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE feedback_feedbackrequest_id_seq OWNED BY feedback_feedbackrequest.id;


--
-- Name: feedback_feedbacksubmission; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE feedback_feedbacksubmission (
    id integer NOT NULL,
    feedback_date timestamp with time zone NOT NULL,
    excels_at text NOT NULL,
    could_improve_on text NOT NULL,
    has_been_delivered boolean NOT NULL,
    feedback_request_id integer,
    reviewer_id integer NOT NULL,
    subject_id integer NOT NULL,
    confidentiality integer NOT NULL,
    unread boolean NOT NULL
);


ALTER TABLE demo.feedback_feedbacksubmission OWNER TO scoutmap;

--
-- Name: feedback_feedbacksubmission_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE feedback_feedbacksubmission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.feedback_feedbacksubmission_id_seq OWNER TO scoutmap;

--
-- Name: feedback_feedbacksubmission_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE feedback_feedbacksubmission_id_seq OWNED BY feedback_feedbacksubmission.id;


--
-- Name: kpi_indicator; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE kpi_indicator (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE demo.kpi_indicator OWNER TO scoutmap;

--
-- Name: kpi_indicator_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE kpi_indicator_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.kpi_indicator_id_seq OWNER TO scoutmap;

--
-- Name: kpi_indicator_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE kpi_indicator_id_seq OWNED BY kpi_indicator.id;


--
-- Name: kpi_performance; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE kpi_performance (
    id integer NOT NULL,
    value numeric(12,2) NOT NULL,
    date timestamp with time zone NOT NULL
);


ALTER TABLE demo.kpi_performance OWNER TO scoutmap;

--
-- Name: kpi_performance_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE kpi_performance_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.kpi_performance_id_seq OWNER TO scoutmap;

--
-- Name: kpi_performance_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE kpi_performance_id_seq OWNED BY kpi_performance.id;


--
-- Name: org_attribute; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE org_attribute (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer
);


ALTER TABLE demo.org_attribute OWNER TO scoutmap;

--
-- Name: org_attribute_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE org_attribute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.org_attribute_id_seq OWNER TO scoutmap;

--
-- Name: org_attribute_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE org_attribute_id_seq OWNED BY org_attribute.id;


--
-- Name: org_attributecategory; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE org_attributecategory (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE demo.org_attributecategory OWNER TO scoutmap;

--
-- Name: org_attributecategory_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE org_attributecategory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.org_attributecategory_id_seq OWNER TO scoutmap;

--
-- Name: org_attributecategory_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE org_attributecategory_id_seq OWNED BY org_attributecategory.id;


--
-- Name: org_employee; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE org_employee (
    id integer NOT NULL,
    job_title character varying(255) NOT NULL,
    hire_date date,
    display boolean NOT NULL,
    team_id integer,
    full_name character varying(255) NOT NULL,
    avatar character varying(100) NOT NULL,
    user_id integer,
    avatar_small character varying(100),
    departure_date date,
    coach_id integer,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255) NOT NULL,
    linkedin_id character varying(255)
);


ALTER TABLE demo.org_employee OWNER TO scoutmap;

--
-- Name: org_employee_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE org_employee_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.org_employee_id_seq OWNER TO scoutmap;

--
-- Name: org_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE org_employee_id_seq OWNED BY org_employee.id;


--
-- Name: org_leadership; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE org_leadership (
    id integer NOT NULL,
    leader_id integer NOT NULL,
    employee_id integer NOT NULL,
    end_date date,
    start_date date NOT NULL
);


ALTER TABLE demo.org_leadership OWNER TO scoutmap;

--
-- Name: org_leadership_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE org_leadership_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.org_leadership_id_seq OWNER TO scoutmap;

--
-- Name: org_leadership_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE org_leadership_id_seq OWNED BY org_leadership.id;


--
-- Name: org_mentorship; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE org_mentorship (
    id integer NOT NULL,
    mentor_id integer NOT NULL,
    mentee_id integer NOT NULL
);


ALTER TABLE demo.org_mentorship OWNER TO scoutmap;

--
-- Name: org_mentorship_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE org_mentorship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.org_mentorship_id_seq OWNER TO scoutmap;

--
-- Name: org_mentorship_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE org_mentorship_id_seq OWNED BY org_mentorship.id;


--
-- Name: org_team; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE org_team (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    leader_id integer
);


ALTER TABLE demo.org_team OWNER TO scoutmap;

--
-- Name: org_team_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE org_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.org_team_id_seq OWNER TO scoutmap;

--
-- Name: org_team_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE org_team_id_seq OWNED BY org_team.id;


--
-- Name: preferences_sitepreferences; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE preferences_sitepreferences (
    id integer NOT NULL,
    show_kolbe boolean NOT NULL,
    show_vops boolean NOT NULL,
    show_mbti boolean NOT NULL,
    show_coaches boolean NOT NULL,
    site_id integer,
    show_timeline boolean NOT NULL,
    survey_email_body text NOT NULL,
    survey_email_subject character varying(255) NOT NULL
);


ALTER TABLE demo.preferences_sitepreferences OWNER TO scoutmap;

--
-- Name: preferences_sitepreferences_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE preferences_sitepreferences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.preferences_sitepreferences_id_seq OWNER TO scoutmap;

--
-- Name: preferences_sitepreferences_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE preferences_sitepreferences_id_seq OWNED BY preferences_sitepreferences.id;


--
-- Name: pvp_evaluationround; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE pvp_evaluationround (
    id integer NOT NULL,
    date date NOT NULL,
    is_complete boolean NOT NULL
);


ALTER TABLE demo.pvp_evaluationround OWNER TO scoutmap;

--
-- Name: pvp_evaluationround_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE pvp_evaluationround_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.pvp_evaluationround_id_seq OWNER TO scoutmap;

--
-- Name: pvp_evaluationround_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE pvp_evaluationround_id_seq OWNED BY pvp_evaluationround.id;


--
-- Name: pvp_pvpdescription; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE pvp_pvpdescription (
    id integer NOT NULL,
    potential integer NOT NULL,
    performance integer NOT NULL,
    description character varying(255) NOT NULL
);


ALTER TABLE demo.pvp_pvpdescription OWNER TO scoutmap;

--
-- Name: pvp_pvpdescription_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE pvp_pvpdescription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.pvp_pvpdescription_id_seq OWNER TO scoutmap;

--
-- Name: pvp_pvpdescription_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE pvp_pvpdescription_id_seq OWNED BY pvp_pvpdescription.id;


--
-- Name: pvp_pvpevaluation; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE pvp_pvpevaluation (
    id integer NOT NULL,
    employee_id integer NOT NULL,
    evaluation_round_id integer NOT NULL,
    potential integer NOT NULL,
    performance integer NOT NULL,
    evaluator_id integer,
    is_complete boolean NOT NULL,
    comment_id integer
);


ALTER TABLE demo.pvp_pvpevaluation OWNER TO scoutmap;

--
-- Name: pvp_pvpevaluation_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE pvp_pvpevaluation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.pvp_pvpevaluation_id_seq OWNER TO scoutmap;

--
-- Name: pvp_pvpevaluation_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE pvp_pvpevaluation_id_seq OWNED BY pvp_pvpevaluation.id;


--
-- Name: south_migrationhistory; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE south_migrationhistory (
    id integer NOT NULL,
    app_name character varying(255) NOT NULL,
    migration character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE demo.south_migrationhistory OWNER TO scoutmap;

--
-- Name: south_migrationhistory_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE south_migrationhistory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.south_migrationhistory_id_seq OWNER TO scoutmap;

--
-- Name: south_migrationhistory_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE south_migrationhistory_id_seq OWNED BY south_migrationhistory.id;


--
-- Name: static_precompiler_dependency; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE static_precompiler_dependency (
    id integer NOT NULL,
    source character varying(255) NOT NULL,
    depends_on character varying(255) NOT NULL
);


ALTER TABLE demo.static_precompiler_dependency OWNER TO scoutmap;

--
-- Name: static_precompiler_dependency_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE static_precompiler_dependency_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.static_precompiler_dependency_id_seq OWNER TO scoutmap;

--
-- Name: static_precompiler_dependency_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE static_precompiler_dependency_id_seq OWNED BY static_precompiler_dependency.id;


--
-- Name: todo_task; Type: TABLE; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE TABLE todo_task (
    id integer NOT NULL,
    created_by_id integer NOT NULL,
    assigned_to_id integer,
    employee_id integer NOT NULL,
    created_date date NOT NULL,
    due_date date,
    description character varying(255) NOT NULL,
    completed boolean NOT NULL,
    assigned_by_id integer
);


ALTER TABLE demo.todo_task OWNER TO scoutmap;

--
-- Name: todo_task_id_seq; Type: SEQUENCE; Schema: demo; Owner: scoutmap
--

CREATE SEQUENCE todo_task_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo.todo_task_id_seq OWNER TO scoutmap;

--
-- Name: todo_task_id_seq; Type: SEQUENCE OWNED BY; Schema: demo; Owner: scoutmap
--

ALTER SEQUENCE todo_task_id_seq OWNED BY todo_task.id;


SET search_path = public, pg_catalog;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_group (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO scoutmap;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO scoutmap;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE auth_group_id_seq OWNED BY auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO scoutmap;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO scoutmap;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE auth_group_permissions_id_seq OWNED BY auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_permission (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO scoutmap;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO scoutmap;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE auth_permission_id_seq OWNED BY auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone NOT NULL,
    is_superuser boolean NOT NULL,
    username character varying(30) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(30) NOT NULL,
    email character varying(75) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO scoutmap;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO scoutmap;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO scoutmap;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE auth_user_groups_id_seq OWNED BY auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO scoutmap;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE auth_user_id_seq OWNED BY auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO scoutmap;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO scoutmap;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE auth_user_user_permissions_id_seq OWNED BY auth_user_user_permissions.id;


--
-- Name: customers_customer; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE customers_customer (
    id integer NOT NULL,
    domain_url character varying(128) NOT NULL,
    schema_name character varying(63) NOT NULL,
    name character varying(100) NOT NULL,
    created_on date NOT NULL,
    show_kolbe boolean NOT NULL,
    show_vops boolean NOT NULL,
    show_mbti boolean NOT NULL,
    show_coaches boolean NOT NULL,
    show_timeline boolean NOT NULL,
    survey_email_body text NOT NULL,
    survey_email_subject character varying(255) NOT NULL
);


ALTER TABLE public.customers_customer OWNER TO scoutmap;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE customers_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_customer_id_seq OWNER TO scoutmap;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE customers_customer_id_seq OWNED BY customers_customer.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO scoutmap;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO scoutmap;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE django_admin_log_id_seq OWNED BY django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_content_type (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO scoutmap;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO scoutmap;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE django_content_type_id_seq OWNED BY django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO scoutmap;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: scoutmap
--

CREATE SEQUENCE django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO scoutmap;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: scoutmap
--

ALTER SEQUENCE django_migrations_id_seq OWNED BY django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE TABLE django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO scoutmap;

SET search_path = demo, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_assessmentband ALTER COLUMN id SET DEFAULT nextval('assessment_assessmentband_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_assessmentcategory ALTER COLUMN id SET DEFAULT nextval('assessment_assessmentcategory_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_assessmentcomparison ALTER COLUMN id SET DEFAULT nextval('assessment_assessmentcomparison_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_assessmenttype ALTER COLUMN id SET DEFAULT nextval('assessment_assessmenttype_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_employeeassessment ALTER COLUMN id SET DEFAULT nextval('assessment_employeeassessment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_mbti ALTER COLUMN id SET DEFAULT nextval('assessment_mbti_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_mbtiemployeedescription ALTER COLUMN id SET DEFAULT nextval('assessment_mbtiemployeedescription_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_mbtiteamdescription ALTER COLUMN id SET DEFAULT nextval('assessment_mbtiteamdescription_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_teamassessmentcluster ALTER COLUMN id SET DEFAULT nextval('assessment_teamassessmentcluster_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_teamassessmentcluster_bands ALTER COLUMN id SET DEFAULT nextval('assessment_teamassessmentcluster_bands_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_group ALTER COLUMN id SET DEFAULT nextval('auth_group_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('auth_group_permissions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_permission ALTER COLUMN id SET DEFAULT nextval('auth_permission_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_user ALTER COLUMN id SET DEFAULT nextval('auth_user_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_groups ALTER COLUMN id SET DEFAULT nextval('auth_user_groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('auth_user_user_permissions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY blah_comment ALTER COLUMN id SET DEFAULT nextval('blah_comment_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY comp_compensationsummary ALTER COLUMN id SET DEFAULT nextval('comp_compensationsummary_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY django_admin_log ALTER COLUMN id SET DEFAULT nextval('django_admin_log_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY django_content_type ALTER COLUMN id SET DEFAULT nextval('django_content_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY django_migrations ALTER COLUMN id SET DEFAULT nextval('django_migrations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY django_site ALTER COLUMN id SET DEFAULT nextval('django_site_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY engagement_happiness ALTER COLUMN id SET DEFAULT nextval('engagement_happiness_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY engagement_surveyurl ALTER COLUMN id SET DEFAULT nextval('engagement_surveyurl_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY feedback_feedbackrequest ALTER COLUMN id SET DEFAULT nextval('feedback_feedbackrequest_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY feedback_feedbacksubmission ALTER COLUMN id SET DEFAULT nextval('feedback_feedbacksubmission_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY kpi_indicator ALTER COLUMN id SET DEFAULT nextval('kpi_indicator_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY kpi_performance ALTER COLUMN id SET DEFAULT nextval('kpi_performance_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_attribute ALTER COLUMN id SET DEFAULT nextval('org_attribute_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_attributecategory ALTER COLUMN id SET DEFAULT nextval('org_attributecategory_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_employee ALTER COLUMN id SET DEFAULT nextval('org_employee_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_leadership ALTER COLUMN id SET DEFAULT nextval('org_leadership_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_mentorship ALTER COLUMN id SET DEFAULT nextval('org_mentorship_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_team ALTER COLUMN id SET DEFAULT nextval('org_team_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY preferences_sitepreferences ALTER COLUMN id SET DEFAULT nextval('preferences_sitepreferences_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY pvp_evaluationround ALTER COLUMN id SET DEFAULT nextval('pvp_evaluationround_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY pvp_pvpdescription ALTER COLUMN id SET DEFAULT nextval('pvp_pvpdescription_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY pvp_pvpevaluation ALTER COLUMN id SET DEFAULT nextval('pvp_pvpevaluation_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY south_migrationhistory ALTER COLUMN id SET DEFAULT nextval('south_migrationhistory_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY static_precompiler_dependency ALTER COLUMN id SET DEFAULT nextval('static_precompiler_dependency_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY todo_task ALTER COLUMN id SET DEFAULT nextval('todo_task_id_seq'::regclass);


SET search_path = public, pg_catalog;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_group ALTER COLUMN id SET DEFAULT nextval('auth_group_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('auth_group_permissions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_permission ALTER COLUMN id SET DEFAULT nextval('auth_permission_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_user ALTER COLUMN id SET DEFAULT nextval('auth_user_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_groups ALTER COLUMN id SET DEFAULT nextval('auth_user_groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('auth_user_user_permissions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY customers_customer ALTER COLUMN id SET DEFAULT nextval('customers_customer_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY django_admin_log ALTER COLUMN id SET DEFAULT nextval('django_admin_log_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY django_content_type ALTER COLUMN id SET DEFAULT nextval('django_content_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY django_migrations ALTER COLUMN id SET DEFAULT nextval('django_migrations_id_seq'::regclass);


SET search_path = demo, pg_catalog;

--
-- Data for Name: assessment_assessmentband; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_assessmentband (id, category_id, min_value, max_value, name, description) FROM stdin;
\.


--
-- Name: assessment_assessmentband_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_assessmentband_id_seq', 1, false);


--
-- Data for Name: assessment_assessmentcategory; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_assessmentcategory (id, assessment_id, name) FROM stdin;
\.


--
-- Name: assessment_assessmentcategory_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_assessmentcategory_id_seq', 1, false);


--
-- Data for Name: assessment_assessmentcomparison; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_assessmentcomparison (id, this_id, that_id, assessed_date, description) FROM stdin;
\.


--
-- Name: assessment_assessmentcomparison_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_assessmentcomparison_id_seq', 1, false);


--
-- Data for Name: assessment_assessmenttype; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_assessmenttype (id, name) FROM stdin;
\.


--
-- Name: assessment_assessmenttype_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_assessmenttype_id_seq', 1, false);


--
-- Data for Name: assessment_employeeassessment; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_employeeassessment (id, employee_id, category_id, score) FROM stdin;
\.


--
-- Name: assessment_employeeassessment_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_employeeassessment_id_seq', 1, false);


--
-- Data for Name: assessment_mbti; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_mbti (id, employee_id, type) FROM stdin;
\.


--
-- Name: assessment_mbti_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_mbti_id_seq', 1, false);


--
-- Data for Name: assessment_mbtiemployeedescription; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_mbtiemployeedescription (id, type, description) FROM stdin;
\.


--
-- Name: assessment_mbtiemployeedescription_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_mbtiemployeedescription_id_seq', 1, false);


--
-- Data for Name: assessment_mbtiteamdescription; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_mbtiteamdescription (id, type, description) FROM stdin;
\.


--
-- Name: assessment_mbtiteamdescription_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_mbtiteamdescription_id_seq', 1, false);


--
-- Data for Name: assessment_teamassessmentcluster; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_teamassessmentcluster (id, name, description) FROM stdin;
\.


--
-- Data for Name: assessment_teamassessmentcluster_bands; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY assessment_teamassessmentcluster_bands (id, teamassessmentcluster_id, assessmentband_id) FROM stdin;
\.


--
-- Name: assessment_teamassessmentcluster_bands_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_teamassessmentcluster_bands_id_seq', 1, false);


--
-- Name: assessment_teamassessmentcluster_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('assessment_teamassessmentcluster_id_seq', 1, false);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY auth_group (id, name) FROM stdin;
3	Daily Digest Subscribers
4	Edit Employee
5	View Comments
1	AllAccess
2	CoachAccess
6	TeamLeadAccess
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_group_id_seq', 6, true);


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_group_permissions_id_seq', 1, false);


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add permission	1	add_permission
2	Can change permission	1	change_permission
3	Can delete permission	1	delete_permission
4	Can add group	2	add_group
5	Can change group	2	change_group
6	Can delete group	2	delete_group
7	Can add user	3	add_user
8	Can change user	3	change_user
9	Can delete user	3	delete_user
10	Can add content type	4	add_contenttype
11	Can change content type	4	change_contenttype
12	Can delete content type	4	delete_contenttype
13	Can add session	5	add_session
14	Can change session	5	change_session
15	Can delete session	5	delete_session
16	Can add site	6	add_site
17	Can change site	6	change_site
18	Can delete site	6	delete_site
19	Can add log entry	7	add_logentry
20	Can change log entry	7	change_logentry
21	Can delete log entry	7	delete_logentry
22	Can add migration history	8	add_migrationhistory
23	Can change migration history	8	change_migrationhistory
24	Can delete migration history	8	delete_migrationhistory
25	Can add employee	9	add_employee
26	Can change employee	9	change_employee
27	Can delete employee	9	delete_employee
28	Can add team	10	add_team
29	Can change team	10	change_team
30	Can delete team	10	delete_team
31	Can add mentorship	11	add_mentorship
32	Can change mentorship	11	change_mentorship
33	Can delete mentorship	11	delete_mentorship
34	Can add leadership	12	add_leadership
35	Can change leadership	12	change_leadership
36	Can delete leadership	12	delete_leadership
37	Can add attribute	13	add_attribute
38	Can change attribute	13	change_attribute
39	Can delete attribute	13	delete_attribute
40	Can add attribute category	14	add_attributecategory
41	Can change attribute category	14	change_attributecategory
42	Can delete attribute category	14	delete_attributecategory
43	Can add compensation summary	15	add_compensationsummary
44	Can change compensation summary	15	change_compensationsummary
45	Can delete compensation summary	15	delete_compensationsummary
46	Can add evaluation round	16	add_evaluationround
47	Can change evaluation round	16	change_evaluationround
48	Can delete evaluation round	16	delete_evaluationround
49	Can add PVP Evaluation	17	add_pvpevaluation
50	Can change PVP Evaluation	17	change_pvpevaluation
51	Can delete PVP Evaluation	17	delete_pvpevaluation
52	Can add comment	18	add_comment
53	Can change comment	18	change_comment
54	Can delete comment	18	delete_comment
55	Can add task	19	add_task
56	Can change task	19	change_task
57	Can delete task	19	delete_task
58	Can add happiness	20	add_happiness
59	Can change happiness	20	change_happiness
60	Can delete happiness	20	delete_happiness
61	Can add mbti employee description	21	add_mbtiemployeedescription
62	Can change mbti employee description	21	change_mbtiemployeedescription
63	Can delete mbti employee description	21	delete_mbtiemployeedescription
64	Can add mbti team description	22	add_mbtiteamdescription
65	Can change mbti team description	22	change_mbtiteamdescription
66	Can delete mbti team description	22	delete_mbtiteamdescription
67	Can add mbti	23	add_mbti
68	Can change mbti	23	change_mbti
69	Can delete mbti	23	delete_mbti
70	Can add assessment type	24	add_assessmenttype
71	Can change assessment type	24	change_assessmenttype
72	Can delete assessment type	24	delete_assessmenttype
73	Can add assessment category	25	add_assessmentcategory
74	Can change assessment category	25	change_assessmentcategory
75	Can delete assessment category	25	delete_assessmentcategory
76	Can add assessment band	26	add_assessmentband
77	Can change assessment band	26	change_assessmentband
78	Can delete assessment band	26	delete_assessmentband
79	Can add employee assessment	27	add_employeeassessment
80	Can change employee assessment	27	change_employeeassessment
81	Can delete employee assessment	27	delete_employeeassessment
82	Can add assessment comparison	28	add_assessmentcomparison
83	Can change assessment comparison	28	change_assessmentcomparison
84	Can delete assessment comparison	28	delete_assessmentcomparison
85	Can add team assessment cluster	29	add_teamassessmentcluster
86	Can change team assessment cluster	29	change_teamassessmentcluster
87	Can delete team assessment cluster	29	delete_teamassessmentcluster
88	Can add indicator	30	add_indicator
89	Can change indicator	30	change_indicator
90	Can delete indicator	30	delete_indicator
91	Can add performance	31	add_performance
92	Can change performance	31	change_performance
93	Can delete performance	31	delete_performance
94	Can add pvp description	32	add_pvpdescription
95	Can change pvp description	32	change_pvpdescription
96	Can delete pvp description	32	delete_pvpdescription
97	Can add site preferences	33	add_sitepreferences
98	Can change site preferences	33	change_sitepreferences
99	Can delete site preferences	33	delete_sitepreferences
100	Can add survey url	34	add_surveyurl
101	Can change survey url	34	change_surveyurl
102	Can delete survey url	34	delete_surveyurl
103	Can add feedback request	35	add_feedbackrequest
104	Can change feedback request	35	change_feedbackrequest
105	Can delete feedback request	35	delete_feedbackrequest
106	Can add feedback submission	36	add_feedbacksubmission
107	Can change feedback submission	36	change_feedbacksubmission
108	Can delete feedback submission	36	delete_feedbacksubmission
109	Can add customer	37	add_customer
110	Can change customer	37	change_customer
111	Can delete customer	37	delete_customer
112	Can add dependency	38	add_dependency
113	Can change dependency	38	change_dependency
114	Can delete dependency	38	delete_dependency
\.


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_permission_id_seq', 114, true);


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
9	pbkdf2_sha256$10000$Ty5OWg5S6otC$CUDmExgrzWSNLsLDtuOGxoHFp4Bg1kIM37y1Da5/AxY=	2015-02-18 09:03:07.500907-05	f	jmcclenathen	James	Mcclenathen	jmcclenathen@fool.com	f	t	2015-02-02 15:13:29-05
4	pbkdf2_sha256$10000$p83eRBNp3Ul0$6bMg2ub1k2M920ON6u9PGiNMWWyJ/abKhVbubE46uKU=	2015-01-09 10:20:09.407848-05	f	lpoliakoff	Lacey	Poliakoff	lpoliakoff@fool.com	f	t	2015-01-09 10:10:17-05
6	pbkdf2_sha256$10000$64zjsT7D8lRv$3bqB5PRqD3AnA/CAgySyi/mkqcalbeW5+DrJ+7i4V/U=	2015-01-09 14:58:48-05	f	mmuraca	Maggie	Muraca	mmuraca@fool.com	f	t	2015-01-09 14:58:48-05
8	pbkdf2_sha256$10000$aM4laIAcofyy$5ZigTSzlXaI32wfb9vL3YT4dqeK1hdwaOao4DZsnO+w=	2015-01-15 13:58:26-05	f	garyh	Gary	Hill	garyh@foolcontractors.com	f	t	2015-01-15 13:58:26-05
3	pbkdf2_sha256$10000$ChaOFitDsixn$MzJRHUB7Jluq9fV0L1NyItXjedB2DVjyG39aCpzjAOg=	2015-01-23 17:34:03.766456-05	f	fool			hippodemo01@fool.com	f	t	2014-03-26 06:26:32-04
5	pbkdf2_sha256$10000$8q2v0mzEZwTT$0G/bkt5PMboCyl2O22GFz3Fywbk0yc51crSASEhU/R0=	2015-01-26 14:00:53.647783-05	f	bbos	Blake	Bos	bbos@fool.com	f	t	2015-01-09 14:57:34-05
2	pbkdf2_sha256$15000$sJPDJcXSZuZF$xWn1jDXXDICOnXBhop9j8KaaU9fH6iUv97O2JkyRhI4=	2015-03-23 14:30:06.83721-04	f	demo			mcmahon.nate@gmail.com	f	t	2014-03-03 20:40:14-05
1	pbkdf2_sha256$15000$CRurFqEpROHF$dVpt2Q3yVRPNDI8f78y/iLTI5lZzO+LZgRPI15WulIk=	2015-04-01 20:36:19.594218-04	t	natedemo			natem@fool.com	t	t	2014-03-03 19:02:36-05
10	!aGoj7SDnLE6OGwEW0e2wyuzvuazgpThYgn2G6HqO	2015-04-13 10:22:32.024498-04	t	demoadmin				t	t	2015-04-13 10:22:32.024547-04
7	pbkdf2_sha256$15000$IEgkCBp7vUoM$9P49VZNmr8OEMuks1SxJTSU6+8DmIaSJwmN/FCilxm4=	2015-04-23 13:29:03.914342-04	t	mkennedy	Mark	Kennedy	mkennedy@fool.com	t	t	2015-01-12 16:47:11-05
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY auth_user_groups (id, user_id, group_id) FROM stdin;
1	1	1
2	1	2
3	1	4
20	4	1
21	4	2
22	4	3
23	4	4
24	5	1
25	5	2
26	5	3
27	5	4
16	3	1
17	3	2
18	3	3
19	3	4
28	5	5
29	6	1
30	6	2
31	6	3
32	6	4
33	6	5
39	8	1
40	8	2
41	8	3
42	8	4
43	8	5
49	9	1
50	9	2
51	9	3
52	9	4
53	9	5
59	7	1
60	7	2
61	7	3
62	7	4
63	7	5
64	2	1
65	2	2
66	2	3
67	2	4
68	2	5
\.


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_user_groups_id_seq', 68, true);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_user_id_seq', 10, true);


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_user_user_permissions_id_seq', 1, false);


--
-- Data for Name: blah_comment; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY blah_comment (id, content_type_id, object_id, owner_content_type_id, owner_id, content, created_date, modified_date, visibility) FROM stdin;
11	9	1356	3	1	dbsdfbfsnsfnsfnsfnsfn	2015-01-15 10:20:14.563931-05	2015-01-15 10:20:14.563985-05	2
2	9	1362	3	2	Integer et nulla non eros ornare egestas. Praesent rutrum elit at nulla consectetur, nec varius nulla commodo. Donec vehicula ultrices faucibus. In hac habitasse platea dictumst. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras sit amet dui elementum, dictum magna a, cursus nulla. Curabitur sit amet viverra dolor. In ornare nisl purus.	2014-03-03 20:47:35.315153-05	2014-03-03 20:48:21.12497-05	2
3	18	2	3	1	Maecenas placerat diam ac mi dapibus, eu rhoncus massa tincidunt. Donec neque ante, placerat eu lorem vitae, pharetra cursus orci. Pellentesque pharetra diam vulputate metus ullamcorper, vel fermentum erat faucibus. Ut rutrum viverra velit eget ullamcorper. Etiam suscipit non tellus ut vestibulum. Phasellus posuere hendrerit tellus, non facilisis leo varius suscipit. Nullam rutrum enim non purus mollis scelerisque. Pellentesque rhoncus imperdiet tristique. Curabitur suscipit, eros a rutrum pulvinar, tortor metus condimentum augue, ac aliquam dolor turpis a tellus. Nulla imperdiet at est nec vehicula. Sed egestas, tortor ut elementum pretium, elit nibh tristique ligula, ac imperdiet magna ligula non tortor.	2014-03-03 20:49:22.509912-05	2014-03-03 20:49:22.509957-05	2
4	9	1396	3	1	Proin aliquam, turpis ac venenatis aliquam, erat dui tincidunt risus, nec auctor lorem tellus vel sem. Praesent odio sapien, euismod vitae pellentesque ut, congue at tortor. Nunc luctus velit nisl, eu cursus purus pharetra dictum. Praesent interdum magna porta eros ullamcorper, a dignissim sapien venenatis. Aliquam mauris mi, lacinia in sem at, tristique ultricies ante. In hac habitasse platea dictumst. Sed viverra id nunc sit amet convallis. Donec risus tortor, elementum sed vestibulum vel, blandit sed sapien. Sed viverra fermentum turpis, eget mattis nibh commodo a. Sed gravida pretium porttitor. Nam id massa bibendum, feugiat odio in, vestibulum justo. Donec id ipsum quam. Nullam vitae fermentum nulla, ac posuere neque.	2014-03-03 20:59:56.063878-05	2014-03-03 20:59:56.063926-05	2
5	18	4	3	2	Aenean a neque sed arcu consequat accumsan eget vitae neque. Praesent posuere consequat sem nec posuere. Nam iaculis diam nibh, nec scelerisque nisl congue sit amet. Sed vel lobortis nisl, ac consectetur erat. Vestibulum cursus, lorem a placerat iaculis, odio nunc tristique nibh, in mattis diam elit vitae purus. Nam in purus a odio fringilla aliquet sed in libero. Vivamus laoreet, metus nec porta dignissim, orci mauris viverra augue, non hendrerit velit urna non sem. Sed quis erat velit.	2014-03-03 21:01:50.980203-05	2014-03-03 21:01:50.98026-05	2
6	9	1417	3	2	Morbi ultrices, eros convallis pretium vehicula, purus mauris sodales est, pharetra adipiscing lacus turpis et turpis. Donec justo lacus, pulvinar ut vulputate vitae, consectetur non lorem. Vestibulum id venenatis augue, et sollicitudin purus. Vestibulum vitae semper nisi, id condimentum quam. Maecenas nec rhoncus diam. Nunc pharetra malesuada neque, non dictum nisi feugiat non. Nulla semper lacinia leo, non scelerisque elit pretium ut. Curabitur justo mauris, consectetur sed sem quis, venenatis magna. Curabitur dapibus accumsan cursus. Donec in dictum ipsum. Suspendisse orci mi, lobortis ac leo ac, tincidunt accumsan erat. Pellentesque at elit purus.	2014-03-03 21:04:27.06582-05	2014-03-03 21:06:00.659268-05	2
12	18	11	3	1	sfnsfnsfnsfn	2015-01-15 10:20:17.876288-05	2015-01-15 10:20:17.876339-05	2
9	9	1417	3	1	Fusce luctus in sem convallis lobortis. Phasellus sit amet magna fermentum, sollicitudin libero eu, pellentesque purus. Integer euismod adipiscing metus eget vestibulum. Nulla egestas rhoncus sapien eget lacinia.	2014-03-27 10:26:48.787037-04	2014-03-27 10:27:23.851832-04	2
13	9	1372	3	5	had a good chcik	2015-01-16 14:40:01.562293-05	2015-01-16 14:40:01.562339-05	2
8	18	6	3	1	Fusce pellentesque sapien velit, non cursus nisi pharetra at. Vivamus nec tellus lectus. Donec egestas vitae diam vitae aliquet. Vestibulum sed arcu ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.	2014-03-26 07:50:56.203848-04	2014-03-27 10:27:43.073918-04	2
14	18	13	3	5	why	2015-01-16 14:40:09.951161-05	2015-01-16 14:40:09.951202-05	2
15	9	1430	3	5	met with cox today, wants more feedback	2015-01-27 11:24:00.972312-05	2015-01-27 11:24:00.972348-05	2
16	9	1430	3	5	hi	2015-01-27 11:43:40.871065-05	2015-01-27 11:43:40.8711-05	2
17	9	1430	3	1	sbsfbsfbsfbsfsf s sf fs sf	2015-02-02 15:06:52.373085-05	2015-02-02 15:06:52.373127-05	2
18	18	17	3	1	advavdadvadva	2015-02-02 15:07:19.107986-05	2015-02-02 15:07:19.108034-05	2
19	9	1444	3	7	What a guy!	2015-02-02 15:09:47.873209-05	2015-02-02 15:09:47.873256-05	2
20	18	19	3	1	yeah he''s not so bad	2015-02-22 16:14:13.064625-05	2015-02-22 16:14:13.064671-05	3
21	9	1444	3	1	Nulla euismod condimentum lectus non egestas. Cras non condimentum mi, in semper neque. Etiam tincidunt justo ut ante ultricies venenatis molestie id risus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce efficitur posuere odio, at tempor est placerat vitae. Nulla facilisi. Nam et pharetra velit. Proin ac leo quis enim dictum dapibus ac id libero. Morbi est lacus, pulvinar blandit blandit vel, tempus at sapien. Cras scelerisque lectus id ex lacinia imperdiet. Proin sit amet ligula pretium, condimentum libero non, aliquam nibh.	2015-02-23 10:54:17.823771-05	2015-02-25 12:12:02.482531-05	2
22	18	21	3	1	Donec placerat sodales nisl. Suspendisse risus sem, bibendum consectetur metus sed, sagittis lacinia quam. Aliquam eleifend, dolor at molestie ornare, nulla odio sollicitudin turpis, sit amet gravida risus massa non nulla. Vestibulum aliquam lectus vel dignissim porta. Nulla suscipit finibus lacus id vulputate.	2015-02-23 10:54:22.373971-05	2015-02-25 12:12:19.186469-05	3
23	9	1358	3	1	Vivamus sollicitudin augue ut porta aliquam. Sed id orci tellus. Suspendisse nec arcu enim. Maecenas laoreet augue turpis, sit amet sodales nibh auctor non. Donec tempor vestibulum semper. Pellentesque neque ante, accumsan sit amet velit vel, hendrerit sagittis massa. Sed accumsan nunc ut eros imperdiet molestie. Sed viverra quam ultricies, semper dolor et, rhoncus purus. Cras enim risus, mattis tincidunt vulputate eget, egestas quis neque. Suspendisse mi nisi, rhoncus eu lorem et, lobortis egestas lacus. Donec eget euismod purus. In fringilla, sapien eget vulputate blandit, mauris felis bibendum tellus, dignissim fermentum urna justo elementum purus. Aliquam sit amet urna id nisl bibendum aliquet in nec lectus. Sed feugiat est arcu, ac bibendum diam interdum aliquet.	2015-02-25 12:14:27.907236-05	2015-02-25 12:14:27.907279-05	2
24	9	1478	3	1	Quisque arcu est, pretium non tincidunt id, ullamcorper nec urna. Suspendisse vel purus mauris. Duis aliquam eros vitae nisl iaculis ornare. Sed id ornare ante. Sed imperdiet felis justo, vehicula mollis sapien scelerisque sed. Vestibulum ornare libero ac tellus vehicula iaculis. Quisque mattis dolor vel neque scelerisque, dapibus euismod neque elementum. Suspendisse finibus libero odio, non consectetur libero hendrerit a. Vivamus ac pharetra massa. Fusce interdum aliquam lorem. Mauris eu augue ornare, laoreet arcu sed, mollis urna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.	2015-02-25 12:14:55.548163-05	2015-02-25 12:14:55.548209-05	2
25	9	1362	3	1	ndslndvlkndlvkdn	2015-02-25 14:11:30.351494-05	2015-02-25 14:11:30.35154-05	2
26	9	1362	3	1	ndslndvlkndlvkdnldknladkv	2015-02-25 14:11:32.577323-05	2015-02-25 14:11:32.577364-05	2
27	9	1362	3	1	ndslndvlkndlvkdnldknladkv	2015-02-25 14:11:34.339813-05	2015-02-25 14:11:34.339856-05	2
28	9	1362	3	1	ndslndvlkndlvkdnldknladkv	2015-02-25 14:11:36.371722-05	2015-02-25 14:11:36.371769-05	2
29	9	1362	3	1	ndslndvlkndlvkdnldknladkv	2015-02-25 14:11:38.517717-05	2015-02-25 14:11:38.517759-05	2
30	9	1362	3	1	ndslndvlkndlvkdnldknladkv	2015-02-25 14:11:40.329707-05	2015-02-25 14:11:40.329758-05	2
31	9	1362	3	1	ndslndvlkndlvkdnldknladkv	2015-02-25 14:11:42.363447-05	2015-02-25 14:11:42.36349-05	2
34	9	1356	3	1	c cz cz zc	2015-02-25 14:11:50.359956-05	2015-02-25 14:11:50.36-05	2
33	9	1417	3	1	Nullam quis facilisis nulla. Donec a ipsum diam. Praesent vehicula lobortis nisl, nec ultricies sem tincidunt eget. Duis sit amet ullamcorper massa. Mauris cursus consequat est quis accumsan. Aliquam erat volutpat. In hac habitasse platea dictumst. In at mattis tortor. Sed eu ipsum sed libero vestibulum congue id at purus. In sed rhoncus ligula, sit amet sodales massa.	2015-02-25 14:11:46.192377-05	2015-02-27 12:41:43.461647-05	2
35	9	1356	3	1	Nullam quis facilisis nulla. Donec a ipsum diam. Praesent vehicula lobortis nisl, nec ultricies sem tincidunt eget. Duis sit amet ullamcorper massa. Mauris cursus consequat est quis accumsan. Aliquam erat volutpat. In hac habitasse platea dictumst. In at mattis tortor. Sed eu ipsum sed libero vestibulum congue id at purus. In sed rhoncus ligula, sit amet sodales massa.	2015-02-25 14:11:51.544262-05	2015-02-27 15:45:36.621823-05	2
32	9	1362	3	1	Quisque quis ipsum vel ex vestibulum pretium non at lacus. Fusce at ex id sem ullamcorper convallis. Sed diam est, molestie quis lorem eu, mollis facilisis felis. Nam dictum, lectus vel luctus lobortis, nisi eros tempus ex, nec facilisis elit lacus eget ex. Duis lectus erat, elementum vitae odio et, fringilla porta elit. Donec suscipit massa eget elementum mollis	2015-02-25 14:11:42.512067-05	2015-02-27 14:41:22.391126-05	2
36	9	1356	3	1	Quisque et porta ipsum, at fringilla lectus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean mollis nunc in magna porta vulputate. Cras dignissim porttitor facilisis. Integer mollis nisi eu ante scelerisque convallis. Vivamus finibus aliquam metus, eu tincidunt velit. Suspendisse mattis id ligula quis finibus.	2015-03-16 15:08:25.976346-04	2015-03-16 15:08:25.976391-04	3
37	9	1498	3	1	Phasellus placerat tellus ut metus sagittis finibus. Suspendisse dolor lorem, gravida quis facilisis et, lacinia non diam. Nunc pharetra eu velit convallis luctus. Nam nec viverra tellus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin posuere, ante non tristique laoreet, libero enim mattis risus, nec convallis libero augue nec felis. Integer ac ante viverra, varius nibh vel, tempor tellus. Quisque vulputate nec velit ut ultrices. In viverra diam facilisis tortor aliquam, aliquet porta urna sodales. Morbi sed aliquet nibh, non egestas est. In hac habitasse platea dictumst.	2015-03-16 15:11:00.97686-04	2015-03-16 15:11:00.976903-04	3
40	18	38	3	1	Phasellus ut nunc et ante tristique sodales vel id nulla. Integer et magna neque. Cras pellentesque ligula id nunc porta, at dapibus odio ullamcorper. Donec condimentum et mi in dignissim. Aliquam sed nisi a augue placerat aliquam. Proin nec egestas nisl, non commodo nunc. Vestibulum ut libero mattis felis ultricies pulvinar eu quis ex. Suspendisse facilisis sit amet libero ac dictum. Pellentesque nunc mi, aliquet a viverra et, elementum eget orci. Phasellus sodales eu quam varius interdum.	2015-03-23 12:44:42.70327-04	2015-03-23 12:44:42.703334-04	3
41	18	36	3	1	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum malesuada imperdiet. Nam tempor suscipit nisi ut laoreet.	2015-03-23 12:49:55.561612-04	2015-03-23 12:49:55.561662-04	3
44	18	38	3	2	Donec condimentum et mi in dignissim. Aliquam sed nisi a augue placerat aliquam. Proin nec egestas nisl, non commodo nunc.	2015-03-23 14:31:05.901043-04	2015-03-23 14:31:05.901088-04	3
38	9	1400	3	3	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum malesuada imperdiet. Nam tempor suscipit nisi ut laoreet.	2015-03-23 10:41:21.82002-04	2015-03-23 14:32:29.878349-04	3
50	18	38	3	1	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum malesuada imperdiet. Nam tempor suscipit nisi ut laoreet.	2015-03-23 14:58:44.21306-04	2015-03-23 14:58:44.213112-04	3
51	18	38	3	2	Suspendisse facilisis sit amet libero ac dictum. Pellentesque nunc mi, aliquet a viverra et, elementum eget orci. Phasellus sodales eu quam varius interdum.	2015-03-23 15:00:48.123298-04	2015-03-23 15:00:48.123343-04	3
\.


--
-- Name: blah_comment_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('blah_comment_id_seq', 51, true);


--
-- Data for Name: comp_compensationsummary; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY comp_compensationsummary (id, employee_id, year, fiscal_year, salary, bonus, discretionary, writer_payments_and_royalties) FROM stdin;
1	1281	2011	0	76999.92	7300.00	0.00	30.00
2	1281	2012	0	76999.92	3965.50	0.00	0.00
3	1281	2013	0	80100.00	4685.85	0.00	0.00
4	1282	2010	0	78000.00	0.00	0.00	0.00
5	1282	2011	0	81100.08	13700.00	0.00	133.00
6	1282	2012	0	94999.92	8353.31	0.00	875.00
7	1282	2013	0	98799.84	11559.58	0.00	0.00
8	1283	2010	0	56000.16	0.00	0.00	0.00
9	1283	2011	0	64999.92	5600.00	0.00	121.00
10	1283	2012	0	64999.92	6694.99	2500.00	0.00
11	1283	2013	0	72000.00	12636.00	2500.00	0.00
12	1284	2010	0	125000.16	0.00	0.00	0.00
13	1284	2011	0	130000.08	43800.00	0.00	88.00
14	1284	2012	0	130000.08	26780.02	0.00	0.00
15	1284	2013	0	135200.16	0.00	0.00	0.00
16	1285	2010	0	88500.00	0.00	0.00	0.00
17	1285	2011	0	93000.00	15500.00	0.00	79.00
18	1285	2012	0	93000.00	9579.00	2500.00	0.00
19	1285	2013	0	96700.08	11313.91	1000.00	0.00
20	1286	2010	0	78500.16	0.00	0.00	0.00
21	1286	2011	0	81700.08	7900.00	0.00	132.00
22	1286	2012	0	81700.08	4207.55	0.00	0.00
23	1286	2013	0	84970.08	4970.75	0.00	0.00
24	1287	2010	0	104000.16	0.00	0.00	0.00
25	1287	2011	0	108160.08	18200.00	0.00	141.00
26	1287	2012	0	108160.08	22280.98	0.00	250.00
27	1287	2013	0	110299.92	25810.18	2500.00	0.00
28	1288	2010	0	136500.00	0.00	0.00	0.00
29	1288	2011	0	145000.08	71700.00	5000.00	179.00
30	1288	2012	0	145000.08	44805.02	10000.00	0.00
31	1288	2013	0	150800.16	0.00	0.00	0.00
32	1289	2010	0	107500.08	0.00	0.00	0.00
33	1289	2011	0	111799.92	18900.00	0.00	105.00
34	1289	2012	0	111799.92	23030.78	0.00	0.00
35	1289	2013	0	116299.92	27214.18	0.00	0.00
36	1290	2010	0	87000.00	0.00	0.00	0.00
37	1290	2011	0	105000.00	15300.00	0.00	134.00
38	1290	2013	0	68952.00	19513.42	1500.00	0.00
39	1291	2010	0	95500.08	0.00	0.00	0.00
40	1291	2011	0	97500.00	16800.00	0.00	113.00
41	1291	2012	0	97500.00	10042.50	0.00	0.00
42	1291	2013	0	101400.00	11863.80	0.00	0.00
43	1292	2011	0	100000.08	4000.00	0.00	114.00
44	1292	2012	0	109999.92	10300.01	0.00	0.00
45	1292	2013	0	114399.84	26769.56	0.00	0.00
46	1293	2011	0	52000.08	2000.00	0.00	158.00
47	1293	2012	0	52000.08	2678.00	10000.00	3500.00
48	1293	2013	0	67599.84	3954.59	0.00	0.00
49	1294	2013	0	67599.84	3954.59	0.00	0.00
50	1295	2011	0	41500.08	1900.00	0.00	73.00
51	1295	2012	0	41500.08	2137.25	0.00	0.00
52	1295	2013	0	45000.00	2632.50	0.00	0.00
53	1296	2011	0	47250.00	2000.00	0.00	97.00
54	1296	2012	0	47250.00	2433.38	0.00	0.00
55	1296	2013	0	49140.00	2874.69	0.00	0.00
56	1297	2011	0	76000.08	4000.00	0.00	139.00
57	1297	2012	0	76000.08	3914.00	0.00	0.00
58	1297	2013	0	79040.16	4623.85	0.00	0.00
59	1298	2011	0	56200.08	2900.00	0.00	4.00
60	1298	2012	0	61999.92	3193.00	0.00	0.00
61	1298	2013	0	64479.84	3772.07	0.00	0.00
62	1299	2011	0	52999.92	3500.00	0.00	181.00
63	1299	2012	0	52999.92	2729.50	1250.00	0.00
64	1299	2013	0	63600.00	3720.60	0.00	0.00
65	1300	2011	0	55200.00	3700.00	0.00	91.00
66	1300	2012	0	55200.00	2842.80	1250.00	50.00
67	1300	2013	0	70000.08	4095.01	2500.00	0.00
68	1301	2011	0	54000.00	4200.00	0.00	53.00
69	1301	2012	0	61000.08	3141.50	1250.00	0.00
70	1301	2013	0	67999.92	7955.99	0.00	0.00
71	1302	2011	0	48000.00	3900.00	2500.00	71.00
72	1302	2013	0	65100.00	3808.35	1000.00	0.00
73	1303	2010	0	58000.08	0.00	0.00	0.00
74	1303	2011	0	65000.16	5800.00	0.00	51.00
75	1303	2012	0	65000.16	3347.51	2500.00	0.00
76	1303	2013	0	76000.08	4446.01	0.00	0.00
77	1304	2011	0	139999.92	58900.00	0.00	166.00
78	1304	2012	0	139999.92	36049.98	0.00	0.00
79	1304	2013	0	145599.84	42587.95	2500.00	0.00
80	1305	2010	0	63500.16	0.00	0.00	0.00
81	1305	2011	0	67000.08	6400.00	0.00	130.00
82	1305	2012	0	67000.08	3450.50	0.00	0.00
83	1305	2013	0	69700.08	4077.45	1000.00	0.00
84	1306	2010	0	101500.08	0.00	0.00	0.00
85	1306	2011	0	109999.92	17800.00	0.00	84.00
86	1306	2012	0	109999.92	22659.98	0.00	0.00
87	1306	2013	0	114399.84	26769.56	0.00	0.00
88	1307	2010	0	52000.08	0.00	0.00	0.00
89	1307	2011	0	72000.00	5200.00	0.00	126.00
90	1307	2012	0	85000.08	8755.01	1250.00	2975.00
91	1307	2013	0	100000.08	11700.01	5000.00	0.00
92	1308	2010	0	52000.08	0.00	0.00	0.00
93	1308	2011	0	67999.92	5200.00	0.00	116.00
94	1308	2012	0	67999.92	3502.00	5000.00	4350.00
95	1308	2013	0	79999.92	9359.99	2500.00	0.00
96	1309	2010	0	60000.00	0.00	0.00	0.00
97	1309	2011	0	70000.08	6000.00	0.00	13.00
98	1309	2012	0	94999.92	7210.01	10000.00	75050.00
99	1309	2013	0	103000.08	0.00	0.00	0.00
100	1310	2010	0	104000.16	0.00	0.00	0.00
101	1310	2011	0	124999.92	0.00	25000.00	144.00
102	1310	2012	0	124999.92	32187.48	0.00	0.00
103	1310	2013	0	129999.84	0.00	0.00	0.00
104	1311	2010	0	52000.08	0.00	0.00	0.00
105	1311	2011	0	72000.00	5200.00	2500.00	77.00
106	1311	2012	0	72000.00	3708.00	5000.00	5044.64
107	1311	2013	0	85000.08	9945.01	5000.00	0.00
108	1312	2010	0	41600.16	0.00	0.00	0.00
109	1312	2011	0	43300.08	4200.00	0.00	131.00
110	1312	2012	0	43300.08	2229.95	0.00	0.00
111	1312	2013	0	45030.00	2634.25	0.00	0.00
112	1313	2013	0	54100.08	3164.85	0.00	0.00
113	1314	2010	0	42700.08	0.00	0.00	0.00
114	1314	2011	0	44400.00	4300.00	0.00	123.00
115	1314	2012	0	44400.00	2286.60	0.00	0.00
116	1314	2013	0	46200.00	2702.70	0.00	0.00
117	1315	2010	0	182000.16	0.00	0.00	0.00
118	1315	2011	0	220000.08	136500.00	0.00	37.00
119	1315	2012	0	220000.08	0.00	0.00	888.00
120	1315	2013	0	228800.16	0.00	0.00	0.00
121	1316	2010	0	72500.16	0.00	0.00	0.00
122	1316	2011	0	75000.00	7300.00	0.00	83.00
123	1316	2012	0	75000.00	3862.50	0.00	0.00
124	1316	2013	0	78000.00	4563.00	0.00	0.00
125	1317	2010	0	176800.08	0.00	0.00	0.00
126	1317	2011	0	184000.08	123800.00	0.00	82.00
127	1317	2012	0	184000.08	79488.04	0.00	0.00
128	1317	2013	0	187600.08	43898.42	0.00	0.00
129	1318	2010	0	114400.08	0.00	0.00	0.00
130	1318	2011	0	120000.00	20100.00	5500.00	3.00
131	1318	2012	0	120000.00	18540.00	2500.00	100.00
132	1318	2013	0	124800.00	21902.40	2500.00	0.00
133	1319	2010	0	113500.08	0.00	0.00	0.00
134	1319	2011	0	126000.00	42000.00	0.00	150.00
135	1319	2012	0	126000.00	25956.00	0.00	0.00
136	1319	2013	0	130999.92	30653.98	0.00	0.00
137	1320	2010	0	61000.08	0.00	0.00	0.00
138	1320	2011	0	63499.92	6100.00	0.00	92.00
139	1320	2012	0	63499.92	3270.25	0.00	0.00
140	1320	2013	0	66039.84	3863.33	0.00	0.00
141	1321	2010	0	88000.08	0.00	0.00	0.00
142	1321	2011	0	93000.00	8800.00	4500.00	178.00
143	1321	2012	0	93000.00	9579.00	10000.00	0.00
144	1321	2013	0	100000.08	23400.02	5000.00	0.00
145	1322	2010	0	93000.00	0.00	0.00	0.00
146	1322	2011	0	94999.92	16300.00	0.00	42.00
147	1322	2012	0	94999.92	9784.99	0.00	0.00
148	1322	2013	0	94999.92	11114.99	0.00	0.00
149	1323	2010	0	83200.08	0.00	0.00	0.00
150	1323	2011	0	86500.08	8400.00	0.00	2.00
151	1323	2012	0	86500.08	4454.75	0.00	0.00
152	1323	2013	0	89960.16	5262.67	0.00	0.00
153	1324	2010	0	93000.00	0.00	0.00	0.00
154	1324	2011	0	96000.00	16300.00	0.00	87.00
155	1324	2012	0	96000.00	9888.00	0.00	0.00
156	1324	2013	0	99799.92	11676.59	0.00	0.00
157	1325	2010	0	80000.16	0.00	0.00	0.00
158	1325	2011	0	91000.08	8000.00	4000.01	152.00
159	1325	2012	0	91000.08	9373.01	0.00	0.00
160	1325	2013	0	100000.08	23400.02	2500.00	0.00
161	1326	2010	0	74700.00	0.00	0.00	0.00
162	1326	2011	0	77688.00	7500.00	0.00	55.00
163	1326	2012	0	77688.00	4000.93	0.00	1975.00
164	1326	2013	0	80800.08	4726.81	0.00	0.00
165	1327	2010	0	86500.08	0.00	0.00	0.00
166	1327	2011	0	90000.00	8700.00	0.00	168.00
167	1327	2012	0	90000.00	9270.00	0.00	0.00
168	1327	2013	0	93600.00	10951.20	0.00	0.00
169	1328	2010	0	65000.16	0.00	0.00	0.00
170	1328	2011	0	69000.00	6500.00	3500.00	160.00
171	1328	2012	0	75000.00	7725.00	5000.00	0.00
172	1328	2013	0	100800.00	17690.40	5000.00	0.00
173	1329	2010	0	92000.16	0.00	0.00	0.00
174	1329	2011	0	97999.92	16100.00	4500.00	180.00
175	1329	2012	0	97999.92	20187.98	2500.00	0.00
176	1329	2013	0	105000.00	24570.00	5000.00	0.00
177	1330	2010	0	88600.08	0.00	0.00	0.00
178	1330	2011	0	91999.92	15500.00	3500.00	50.00
179	1330	2012	0	91999.92	9475.99	1250.00	0.00
180	1330	2013	0	95700.00	11196.90	0.00	0.00
181	1331	2010	0	115500.00	0.00	0.00	0.00
182	1331	2011	0	120199.92	30400.00	0.00	129.00
183	1331	2012	0	130000.08	20085.01	10000.00	17854.57
184	1331	2013	0	130000.08	30420.02	0.00	0.00
185	1332	2010	0	92100.00	0.00	0.00	0.00
186	1332	2011	0	95800.08	16200.00	0.00	78.00
187	1332	2012	0	95800.08	9867.41	0.00	0.00
188	1332	2013	0	97699.92	11430.89	0.00	0.00
189	1333	2010	0	285000.00	0.00	0.00	0.00
190	1333	2011	0	285000.00	0.00	190000.00	143.00
191	1333	2012	0	285000.00	0.00	0.00	0.00
192	1333	2013	0	285000.00	66690.00	5000.00	0.00
193	1334	2010	0	80600.16	0.00	0.00	0.00
194	1334	2011	0	84499.92	14100.00	0.00	182.00
195	1334	2012	0	84499.92	8703.49	0.00	0.00
196	1334	2013	0	87900.00	10284.30	0.00	0.00
197	1335	2010	0	97800.00	0.00	0.00	0.00
198	1335	2011	0	100800.00	17200.00	0.00	159.00
199	1335	2012	0	100800.00	10382.40	0.00	0.00
200	1335	2013	0	102799.92	12027.59	0.00	0.00
201	1336	2010	0	92500.08	0.00	0.00	0.00
202	1336	2011	0	100000.08	16200.00	0.00	163.00
203	1336	2012	0	100000.08	10300.01	2500.00	25.00
204	1336	2013	0	110000.16	25740.04	0.00	0.00
205	1337	2010	0	100000.08	0.00	0.00	0.00
206	1337	2011	0	124999.92	0.00	12000.00	102.00
207	1337	2012	0	124999.92	32187.48	0.00	3075.50
208	1337	2013	0	125178.30	44281.82	2500.00	0.00
209	1338	2010	0	87000.00	0.00	0.00	0.00
210	1338	2011	0	90000.00	15300.00	0.00	1.00
211	1338	2012	0	90000.00	9270.00	0.00	0.00
212	1338	2013	0	93600.00	0.00	0.00	0.00
213	1339	2010	0	83200.08	0.00	0.00	0.00
214	1339	2011	0	86500.08	8400.00	0.00	149.00
215	1339	2012	0	86500.08	4454.75	0.00	0.00
216	1339	2013	0	89960.16	5262.67	0.00	0.00
217	1340	2010	0	68000.16	0.00	0.00	0.00
218	1340	2011	0	78000.00	6800.00	2500.00	140.00
219	1340	2012	0	78000.00	4017.00	2500.00	0.00
220	1340	2013	0	82999.92	4855.49	2500.00	0.00
221	1341	2010	0	130000.08	0.00	0.00	0.00
222	1341	2011	0	160000.08	0.00	37500.00	81.00
223	1341	2012	0	160000.08	49440.02	0.00	109376.00
224	1341	2013	0	166400.16	58406.46	0.00	0.00
225	1342	2010	0	79500.00	0.00	0.00	0.00
226	1342	2011	0	102000.00	8000.00	0.00	27.00
227	1342	2012	0	102000.00	15759.00	0.00	0.00
228	1342	2013	0	106080.00	18617.04	0.00	0.00
229	1343	2010	0	63500.16	0.00	0.00	0.00
230	1343	2011	0	72000.00	6400.00	0.00	142.00
231	1343	2012	0	72000.00	3708.00	0.00	187095.00
232	1343	2013	0	74880.00	4380.48	0.00	0.00
233	1344	2010	0	68000.16	0.00	0.00	0.00
234	1344	2011	0	90000.00	6800.00	2500.00	12.00
235	1344	2012	0	105000.00	9270.00	10000.00	1125.00
236	1344	2013	0	109999.92	0.00	0.00	0.00
237	1345	2010	0	78000.00	0.00	0.00	0.00
238	1345	2011	0	81199.92	13700.00	0.00	24.00
239	1345	2012	0	81199.92	4181.80	0.00	0.00
240	1345	2013	0	87700.08	10260.91	0.00	0.00
241	1346	2010	0	85700.16	0.00	0.00	0.00
242	1346	2011	0	89100.00	15000.00	0.00	72.00
243	1346	2012	0	89100.00	9177.30	0.00	0.00
244	1346	2013	0	92700.00	10845.90	0.00	0.00
245	1347	2010	0	87600.00	0.00	0.00	0.00
246	1347	2011	0	87600.00	15400.00	0.00	110.00
247	1347	2012	0	87600.00	9022.80	0.00	18238.02
248	1347	2013	0	91099.92	10658.69	0.00	0.00
249	1348	2010	0	61500.00	0.00	0.00	0.00
250	1348	2011	0	81000.00	6200.00	0.00	98.00
251	1348	2012	0	81000.00	8343.00	2500.00	6125.00
252	1348	2013	0	84199.92	9851.39	1000.00	0.00
253	1349	2010	0	55000.08	0.00	0.00	0.00
254	1349	2011	0	57000.00	5500.00	0.00	15.00
255	1349	2012	0	57000.00	2935.50	0.00	0.00
256	1349	2013	0	59280.00	3467.88	0.00	0.00
257	1350	2010	0	68500.08	0.00	0.00	0.00
258	1350	2011	0	75000.00	12600.00	2500.00	170.00
259	1350	2012	0	75000.00	7725.00	0.00	0.00
260	1350	2013	0	78000.00	9126.00	0.00	0.00
261	1351	2010	0	49000.08	0.00	0.00	0.00
262	1351	2011	0	51000.00	4900.00	0.00	44.00
263	1351	2012	0	51000.00	2626.50	0.00	0.00
264	1351	2013	0	53040.00	0.00	0.00	0.00
265	1352	2010	0	47000.16	0.00	0.00	0.00
266	1352	2011	0	49000.08	4700.00	0.00	23.00
267	1352	2012	0	49000.08	2523.50	5000.00	0.00
268	1352	2013	0	60500.16	3539.26	0.00	0.00
269	1353	2010	0	65000.16	0.00	0.00	0.00
270	1353	2011	0	67999.92	6500.00	0.00	119.00
271	1353	2012	0	72000.00	7416.00	0.00	1737.50
272	1353	2013	0	79999.92	9359.99	0.00	0.00
273	1354	2010	0	124800.00	0.00	0.00	0.00
274	1354	2011	0	130000.08	21900.00	6500.00	161.00
275	1354	2012	0	130000.08	26780.02	0.00	0.00
276	1354	2013	0	135200.16	31636.84	0.00	0.00
277	1355	2010	0	182000.16	0.00	0.00	0.00
278	1355	2011	0	250000.08	0.00	25000.00	66.00
279	1355	2012	0	250000.08	103000.03	10000.00	0.00
280	1355	2013	0	316500.00	0.00	0.00	0.00
281	1356	2010	0	125000.16	0.00	0.00	0.00
282	1356	2011	0	165000.00	0.00	31000.00	68.00
283	1356	2013	0	161199.84	0.00	0.00	0.00
284	1357	2010	0	79000.08	0.00	0.00	0.00
285	1357	2011	0	82200.00	13900.00	0.00	125.00
286	1357	2012	0	82200.00	8466.60	0.00	0.00
287	1357	2013	0	85500.00	10003.50	0.00	0.00
288	1358	2010	0	53500.08	0.00	0.00	0.00
289	1358	2011	0	55500.00	5400.00	0.00	111.00
290	1358	2012	0	55500.00	2858.25	1250.00	0.00
291	1358	2013	0	57720.00	3376.62	0.00	0.00
292	1359	2010	0	92000.16	0.00	0.00	0.00
293	1359	2011	0	103999.92	16100.00	4500.00	108.00
294	1359	2012	0	103999.92	21423.98	5000.00	0.00
295	1359	2013	0	112000.08	26208.02	7500.00	0.00
296	1360	2010	0	149000.16	0.00	0.00	0.00
297	1360	2011	0	154999.92	0.00	30000.00	11.00
298	1360	2012	0	154999.92	31929.98	0.00	0.00
299	1360	2013	0	158100.00	36995.40	0.00	0.00
300	1361	2010	0	78000.00	0.00	0.00	0.00
301	1361	2011	0	120000.00	13700.00	4000.00	5.00
302	1361	2012	0	120000.00	24720.00	2500.00	5725.00
303	1361	2013	0	124800.00	0.00	0.00	0.00
304	1362	2010	0	67500.00	0.00	0.00	0.00
305	1362	2011	0	78000.00	6800.00	3500.00	174.00
306	1362	2012	0	90000.00	8034.00	0.00	250.00
307	1362	2013	0	93600.00	10951.20	5000.00	0.00
308	1363	2010	0	58000.08	0.00	0.00	0.00
309	1363	2011	0	60300.00	5800.00	0.00	175.00
310	1363	2012	0	60300.00	3105.45	0.00	8325.00
311	1363	2013	0	62700.00	3667.95	0.00	0.00
312	1364	2010	0	62500.08	0.00	0.00	0.00
313	1364	2011	0	67000.08	6300.00	0.00	165.00
314	1364	2012	0	67000.08	6901.01	0.00	375.50
315	1364	2013	0	69680.16	8152.58	2500.00	0.00
316	1365	2010	0	75000.00	0.00	0.00	0.00
317	1365	2011	0	75000.00	13200.00	0.00	172.00
318	1365	2013	0	54080.00	7652.32	3000.00	0.00
319	1366	2010	0	75000.00	0.00	0.00	0.00
320	1366	2011	0	90000.00	13200.00	3800.00	38.00
321	1366	2012	0	94500.00	9270.00	10000.00	1500.00
322	1366	2013	0	124999.92	29249.98	5000.00	0.00
323	1367	2010	0	57200.16	0.00	0.00	0.00
324	1367	2011	0	59500.08	5800.00	0.00	47.00
325	1367	2012	0	59500.08	3064.25	0.00	7925.00
326	1367	2013	0	70999.92	4153.49	0.00	0.00
327	1368	2010	0	66300.00	0.00	0.00	0.00
328	1368	2011	0	69000.00	6700.00	3500.00	14.00
329	1368	2012	0	69000.00	3553.50	0.00	0.00
330	1368	2013	0	74880.00	8760.96	2500.00	0.00
331	1369	2010	0	100000.08	0.00	0.00	0.00
332	1369	2011	0	104000.16	0.00	11500.00	65.00
333	1369	2012	0	115000.08	23690.02	0.00	600.00
334	1369	2013	0	117300.00	27448.20	0.00	0.00
335	1370	2010	0	60000.00	0.00	0.00	0.00
336	1370	2011	0	62500.08	6000.00	3000.00	115.00
337	1370	2012	0	62500.08	3218.75	0.00	138225.00
338	1370	2013	0	65000.16	0.00	0.00	0.00
339	1371	2010	0	120000.00	0.00	0.00	0.00
340	1371	2011	0	139999.92	42000.00	0.00	99.00
341	1371	2012	0	139999.92	43259.98	5000.00	0.00
342	1371	2013	0	150000.00	52650.00	10000.00	0.00
343	1372	2010	0	104000.16	0.00	0.00	0.00
344	1372	2011	0	104000.16	0.00	0.00	173.00
345	1372	2012	0	104000.16	0.00	10000.00	176114.00
346	1372	2013	0	108199.92	0.00	2500.00	0.00
347	1373	2010	0	41400.00	0.00	0.00	0.00
348	1373	2011	0	46500.00	4200.00	0.00	138.00
349	1373	2012	0	46500.00	2394.75	0.00	0.00
350	1373	2013	0	48360.00	2829.06	0.00	0.00
351	1374	2010	0	48600.00	0.00	0.00	0.00
352	1374	2011	0	56700.00	9700.00	0.00	101.00
353	1374	2012	0	56700.00	5840.10	0.00	0.00
354	1374	2013	0	58950.00	6897.15	0.00	0.00
355	1375	2010	0	89000.16	0.00	0.00	0.00
356	1375	2011	0	91800.00	9000.00	0.00	122.00
357	1375	2012	0	91800.00	9455.40	0.00	0.00
358	1375	2013	0	100000.08	11700.01	2500.00	0.00
359	1376	2010	0	69000.00	0.00	0.00	0.00
360	1376	2011	0	72000.00	6900.00	0.00	103.00
361	1376	2012	0	72000.00	3708.00	0.00	0.00
362	1376	2013	0	74880.00	4380.48	0.00	0.00
363	1377	2010	0	88400.16	0.00	0.00	0.00
364	1377	2011	0	93700.08	15500.00	0.00	18.00
365	1377	2012	0	93700.08	9651.11	0.00	0.00
366	1377	2013	0	97450.08	11401.66	2500.00	0.00
367	1378	2010	0	88400.16	0.00	0.00	0.00
368	1378	2011	0	91000.08	15500.00	0.00	75.00
369	1378	2012	0	91000.08	9373.01	0.00	33888.00
370	1378	2013	0	94600.08	11068.21	2500.00	0.00
371	1379	2010	0	104000.16	0.00	0.00	0.00
372	1379	2011	0	109999.92	18200.00	5000.00	67.00
373	1379	2012	0	109999.92	22659.98	5000.00	0.00
374	1379	2013	0	124999.92	43874.98	0.00	0.00
375	1380	2010	0	78400.08	0.00	0.00	0.00
376	1380	2011	0	82000.08	13800.00	4000.00	33.00
377	1380	2012	0	82000.08	8446.01	1250.00	0.00
378	1380	2013	0	90000.00	10530.00	0.00	0.00
379	1381	2010	0	67600.08	0.00	0.00	0.00
380	1381	2011	0	76000.08	6800.00	1500.00	39.00
381	1381	2012	0	76000.08	7828.01	0.00	0.00
382	1381	2013	0	79040.16	9247.70	0.00	0.00
383	1382	2010	0	101200.08	0.00	0.00	0.00
384	1382	2011	0	108000.00	17800.00	0.00	127.00
385	1382	2012	0	108000.00	16686.00	1250.00	0.00
386	1382	2013	0	110200.08	0.00	0.00	0.00
387	1383	2010	0	210000.00	0.00	0.00	0.00
388	1383	2011	0	220000.08	147000.00	0.00	63.00
389	1383	2012	0	220000.08	0.00	0.00	250.00
390	1383	2013	0	228800.16	0.00	0.00	0.00
391	1384	2010	0	71600.16	0.00	0.00	0.00
392	1384	2011	0	74500.08	7200.00	0.00	117.00
393	1384	2012	0	74500.08	3836.75	0.00	3350.00
394	1384	2013	0	77500.08	9067.51	2500.00	0.00
395	1385	2010	0	100000.08	0.00	0.00	0.00
396	1385	2011	0	106000.08	35000.00	2500.00	22.00
397	1385	2012	0	106000.08	21836.02	0.00	0.00
398	1385	2013	0	112000.08	26208.02	5000.00	0.00
399	1386	2013	0	63440.00	8976.76	0.00	0.00
400	1387	2010	0	78000.00	0.00	0.00	0.00
401	1387	2011	0	78000.00	13200.00	0.00	183.00
402	1387	2012	0	78000.00	8034.00	0.00	125.00
403	1387	2013	0	81100.08	9488.71	0.00	0.00
404	1388	2012	0	45360.00	2336.04	1250.00	0.00
405	1388	2013	0	55000.08	3217.51	2500.00	0.00
406	1389	2013	0	60320.00	8535.28	3000.00	0.00
407	1390	2010	0	71400.00	0.00	0.00	0.00
408	1390	2011	0	74500.08	12500.00	3500.00	31.00
409	1390	2012	0	74500.08	7673.51	0.00	234750.00
410	1390	2013	0	77500.08	9067.51	0.00	0.00
411	1391	2010	0	100000.08	0.00	0.00	0.00
412	1391	2011	0	119600.16	17500.00	0.00	48.00
413	1391	2012	0	119600.16	18478.22	5000.00	0.00
414	1391	2013	0	124399.92	21832.18	5000.00	0.00
415	1392	2010	0	41600.16	0.00	0.00	0.00
416	1392	2011	0	43300.08	4200.00	0.00	148.00
417	1392	2012	0	43300.08	2229.95	0.00	0.00
418	1392	2013	0	45030.00	2634.25	0.00	0.00
419	1393	2010	0	103800.00	0.00	0.00	0.00
420	1393	2011	0	108000.00	18200.00	0.00	69.00
421	1393	2012	0	108000.00	16686.00	0.00	500.00
422	1393	2013	0	112300.08	19708.66	2500.00	0.00
423	1394	2010	0	128400.00	0.00	0.00	0.00
424	1394	2011	0	133500.00	45000.00	0.00	94.00
425	1394	2012	0	133500.00	27501.00	0.00	0.00
426	1394	2013	0	138799.92	32479.18	5000.00	0.00
427	1395	2010	0	61800.00	0.00	0.00	0.00
428	1395	2011	0	63400.08	6200.00	0.00	176.00
429	1395	2012	0	63400.08	3265.10	0.00	18725.00
430	1395	2013	0	70000.08	4095.01	0.00	0.00
431	1396	2013	0	100000.08	0.00	0.00	0.00
432	1397	2010	0	83200.08	0.00	0.00	0.00
433	1397	2011	0	86500.08	14600.00	0.00	156.00
434	1397	2012	0	86500.08	8909.51	0.00	0.00
435	1397	2013	0	115000.08	20182.52	0.00	0.00
436	1398	2010	0	89700.00	0.00	0.00	0.00
437	1398	2011	0	93300.00	15700.00	0.00	90.00
438	1398	2012	0	93300.00	9609.90	0.00	25.00
439	1398	2013	0	97000.08	11349.01	0.00	0.00
440	1399	2010	0	206000.16	0.00	0.00	0.00
441	1399	2011	0	214249.92	0.00	115000.00	86.00
442	1399	2012	0	214249.92	0.00	10000.00	0.00
443	1399	2013	0	222799.92	104270.36	2500.00	0.00
444	1400	2013	0	364000.08	170352.04	10000.00	0.00
445	1401	2010	0	350000.16	0.00	0.00	0.00
446	1401	2011	0	375000.00	0.00	0.00	54.00
447	1401	2012	0	432000.00	177984.00	10000.00	164215.00
448	1401	2013	0	450000.00	210600.00	10000.00	0.00
449	1402	2010	0	55500.00	0.00	0.00	0.00
450	1402	2011	0	57750.00	5600.00	0.00	135.00
451	1402	2012	0	57750.00	2974.13	0.00	184.00
452	1402	2013	0	69300.00	4054.05	0.00	0.00
453	1403	2010	0	46800.00	0.00	0.00	0.00
454	1403	2011	0	62400.00	6000.00	0.00	8.00
455	1403	2012	0	62400.00	3213.60	1250.00	0.00
456	1403	2013	0	64900.08	3796.65	0.00	0.00
457	1404	2010	0	49000.08	0.00	0.00	0.00
458	1404	2011	0	51000.00	4900.00	0.00	169.00
459	1404	2012	0	60000.00	3090.00	0.00	0.00
460	1404	2013	0	62400.00	3650.40	0.00	0.00
461	1405	2010	0	70000.08	0.00	0.00	0.00
462	1405	2011	0	72799.92	12300.00	3500.00	10.00
463	1405	2012	0	72799.92	7498.39	0.00	1000.00
464	1405	2013	0	83199.84	9734.38	5000.00	0.00
465	1406	2010	0	104000.16	0.00	0.00	0.00
466	1406	2011	0	124999.92	0.00	22500.00	164.00
467	1406	2012	0	124999.92	32187.48	5000.00	4687.74
468	1406	2013	0	142999.92	41827.47	2500.00	0.00
469	1407	2010	0	57200.16	0.00	0.00	0.00
470	1407	2011	0	62000.16	5800.00	3000.00	0.00
471	1407	2012	0	62000.16	3193.01	0.00	1225.00
472	1407	2013	0	64480.08	3772.09	1000.00	0.00
473	1408	2010	0	86000.16	0.00	0.00	0.00
474	1408	2011	0	90000.00	15100.00	0.00	124.00
475	1408	2012	0	90000.00	9270.00	0.00	1738.00
476	1408	2013	0	93600.00	10951.20	0.00	0.00
477	1409	2010	0	104000.16	0.00	0.00	0.00
478	1409	2011	0	124999.92	0.00	22500.00	109.00
479	1409	2012	0	124999.92	32187.48	0.00	9475.50
480	1409	2013	0	124999.92	29249.98	0.00	0.00
481	1410	2010	0	154500.00	0.00	0.00	0.00
482	1410	2011	0	154500.00	0.00	11500.00	46.00
483	1410	2012	0	154500.00	39011.25	0.00	2850.00
484	1410	2013	0	169000.08	49432.53	2500.00	0.00
485	1411	2010	0	91500.00	0.00	0.00	0.00
486	1411	2011	0	94500.00	16000.00	0.00	64.00
487	1411	2012	0	94500.00	9733.50	0.00	27688.00
488	1411	2013	0	98299.92	11501.09	1000.00	0.00
489	1412	2010	0	91900.08	0.00	0.00	0.00
490	1412	2011	0	95500.08	9200.00	0.00	157.00
491	1412	2012	0	95500.08	9836.51	2500.00	0.00
492	1412	2013	0	100000.08	11700.01	2500.00	0.00
493	1413	2010	0	61000.08	0.00	0.00	0.00
494	1413	2011	0	63000.00	6100.00	0.00	61.00
495	1413	2012	0	63000.00	3244.50	0.00	0.00
496	1413	2013	0	65500.08	3831.75	0.00	0.00
497	1414	2010	0	92500.08	0.00	0.00	0.00
498	1414	2011	0	97999.92	16200.00	0.00	74.00
499	1414	2012	0	97999.92	10093.99	10000.00	0.00
500	1414	2013	0	124999.92	29249.98	10000.00	0.00
501	1415	2010	0	118000.08	0.00	0.00	0.00
502	1415	2011	0	120000.00	20700.00	0.00	52.00
503	1415	2012	0	120000.00	24720.00	0.00	0.00
504	1415	2013	0	122400.00	28641.60	0.00	0.00
505	1416	2010	0	96700.08	0.00	0.00	0.00
506	1416	2011	0	100600.08	33900.00	0.00	62.00
507	1416	2013	0	98142.00	27774.19	0.00	0.00
508	1417	2010	0	85000.08	0.00	0.00	0.00
509	1417	2011	0	104000.16	14900.00	0.00	36.00
510	1417	2012	0	104000.16	16068.02	10000.00	0.00
511	1417	2013	0	120000.00	28080.00	10000.00	0.00
512	1418	2010	0	78000.00	0.00	0.00	0.00
513	1418	2011	0	81100.08	13700.00	0.00	147.00
514	1418	2012	0	85050.00	8760.15	0.00	0.00
515	1418	2013	0	88450.08	10348.66	0.00	0.00
516	1419	2010	0	135000.00	0.00	0.00	0.00
517	1419	2011	0	135000.00	47300.00	0.00	136.00
518	1419	2012	0	135000.00	27810.00	0.00	8337.50
519	1419	2013	0	137700.00	16110.90	0.00	0.00
520	1420	2010	0	126800.16	0.00	0.00	0.00
521	1420	2011	0	140400.00	22200.00	16000.00	58.00
522	1420	2012	0	140400.00	28922.40	2500.00	2100.00
523	1420	2013	0	146100.00	51281.10	7500.00	0.00
524	1421	2010	0	110700.00	0.00	0.00	0.00
525	1421	2011	0	118000.08	38800.00	15500.00	137.00
526	1421	2012	0	124999.92	24308.02	10000.00	6175.00
527	1421	2013	0	135000.00	47385.00	5000.00	0.00
528	1422	2010	0	76500.00	0.00	0.00	0.00
529	1422	2011	0	79600.08	13400.00	4000.00	120.00
530	1422	2012	0	79600.08	8198.81	0.00	375.00
531	1422	2013	0	90000.00	10530.00	0.00	0.00
532	1423	2010	0	148000.08	0.00	0.00	0.00
533	1423	2011	0	175000.08	64800.00	7500.00	96.00
534	1423	2012	0	175000.08	72100.03	5000.00	0.00
535	1423	2013	0	190000.08	88920.04	10000.00	0.00
536	1424	2010	0	101200.08	0.00	0.00	0.00
537	1424	2011	0	103200.00	17800.00	0.00	49.00
538	1424	2012	0	103200.00	10629.60	0.00	0.00
539	1424	2013	0	105300.00	12320.10	0.00	0.00
540	1425	2010	0	115500.00	0.00	0.00	0.00
541	1425	2011	0	123000.00	20300.00	5500.00	28.00
542	1425	2012	0	123000.00	25338.00	0.00	0.00
543	1425	2013	0	127900.08	29928.62	1000.00	0.00
544	1426	2010	0	142500.00	0.00	0.00	0.00
545	1426	2011	0	150000.00	74900.00	0.00	34.00
546	1426	2012	0	150000.00	46350.00	0.00	0.00
547	1426	2013	0	156000.00	54756.00	0.00	0.00
548	1427	2010	0	195000.00	0.00	0.00	0.00
549	1427	2011	0	204000.00	136500.00	0.00	76.00
550	1427	2012	0	204000.00	84048.00	2500.00	0.00
551	1427	2013	0	212200.08	99309.64	0.00	0.00
552	1428	2013	0	257500.08	120510.04	5000.00	0.00
553	1429	2013	0	52000.00	3679.00	0.00	0.00
554	1430	2010	0	156000.00	0.00	0.00	0.00
555	1430	2011	0	160000.08	0.00	25000.00	19.00
556	1430	2012	0	160000.08	49440.02	0.00	0.00
557	1430	2013	0	166400.16	58406.46	5000.00	0.00
558	1431	2010	0	78000.00	0.00	0.00	0.00
559	1431	2011	0	80500.08	7800.00	0.00	112.00
560	1431	2012	0	80500.08	4145.75	0.00	19957.00
561	1431	2013	0	83700.00	4896.45	0.00	0.00
562	1432	2010	0	112500.00	0.00	0.00	0.00
563	1432	2011	0	116800.08	19700.00	0.00	57.00
564	1432	2012	0	116800.08	18045.61	0.00	0.00
565	1432	2013	0	121500.00	0.00	0.00	0.00
566	1433	2013	0	52000.00	3679.00	0.00	0.00
567	1434	2013	0	125000.00	17687.50	1250.00	0.00
568	1435	2010	0	139000.08	0.00	0.00	0.00
569	1435	2011	0	144600.00	48700.00	0.00	89.00
570	1435	2012	0	144600.00	29787.60	0.00	0.00
571	1435	2013	0	144600.00	33836.40	0.00	0.00
572	1436	2010	0	168000.00	0.00	0.00	0.00
573	1436	2011	0	169999.92	117600.00	0.00	17.00
574	1436	2012	0	169999.92	0.00	0.00	0.00
575	1436	2013	0	169999.92	39779.98	0.00	0.00
576	1437	2010	0	105000.00	0.00	0.00	0.00
577	1437	2011	0	109200.00	36800.00	0.00	70.00
578	1437	2012	0	109200.00	22495.20	0.00	350.00
579	1437	2013	0	113599.92	0.00	0.00	0.00
580	1438	2010	0	85100.16	0.00	0.00	0.00
581	1438	2011	0	88500.00	14900.00	0.00	29.00
582	1438	2012	0	88500.00	9115.50	5000.00	0.00
583	1438	2013	0	97999.92	17198.98	2500.00	0.00
584	1439	2013	0	89950.08	10524.16	7500.00	0.00
585	1440	2010	0	99600.00	0.00	0.00	0.00
586	1440	2011	0	103600.08	34900.00	0.00	56.00
587	1440	2012	0	103600.08	21341.62	2500.00	0.00
588	1440	2013	0	107500.08	25155.02	5000.00	0.00
589	1441	2011	0	82999.92	6600.00	0.00	146.00
590	1441	2012	0	82999.92	8548.99	0.00	0.00
591	1441	2013	0	88000.08	10296.01	2500.00	0.00
592	1442	2010	0	146000.16	0.00	0.00	0.00
593	1442	2011	0	160000.08	63900.00	5000.00	9.00
594	1442	2012	0	160000.08	49440.02	5000.00	0.00
595	1442	2013	0	166400.16	0.00	0.00	0.00
596	1443	2013	0	50960.00	7210.84	1500.00	0.00
597	1444	2010	0	52000.08	0.00	0.00	0.00
598	1444	2011	0	55000.08	5200.00	0.00	167.00
599	1444	2012	0	55000.08	2832.50	5000.00	0.00
600	1444	2013	0	64479.84	3772.07	0.00	0.00
601	1445	2011	0	57199.92	3000.00	2500.00	6.00
602	1445	2012	0	57199.92	2945.80	0.00	2350.00
603	1445	2013	0	74000.00	5235.50	0.00	0.00
604	1446	2013	0	137899.92	40335.73	0.00	0.00
605	1447	2011	0	70000.08	4300.00	0.00	118.00
606	1447	2012	0	70000.08	3605.00	0.00	400.00
607	1447	2013	0	90000.00	0.00	0.00	0.00
608	1448	2013	0	113400.00	0.00	0.00	0.00
609	1449	2010	0	101500.08	0.00	0.00	0.00
610	1449	2011	0	105499.92	17800.00	0.00	155.00
611	1449	2012	0	105499.92	10866.49	0.00	0.00
612	1449	2013	0	109699.92	12834.89	0.00	0.00
613	1450	2010	0	79000.08	0.00	0.00	0.00
614	1450	2011	0	81400.08	13900.00	0.00	100.00
615	1450	2012	0	81400.08	8384.21	0.00	0.00
616	1450	2013	0	84649.92	9904.04	0.00	0.00
617	1451	2010	0	60000.00	0.00	0.00	0.00
618	1451	2011	0	61800.00	6000.00	0.00	7.00
619	1451	2012	0	61800.00	3182.70	5000.00	0.00
620	1451	2013	0	84000.00	9828.00	2500.00	0.00
621	1452	2010	0	149000.16	0.00	0.00	0.00
622	1452	2011	0	155000.16	78300.00	1700.00	85.00
623	1452	2012	0	155000.16	47895.05	10000.00	0.00
624	1452	2013	0	182000.16	63882.06	10000.00	0.00
625	1453	2011	0	91000.08	1800.00	0.00	154.00
626	1453	2012	0	91000.08	9373.01	0.00	0.00
627	1453	2013	0	94600.08	11068.21	0.00	0.00
628	1454	2011	0	42499.92	700.00	0.00	16.00
629	1454	2012	0	42499.92	2188.75	5000.00	0.00
630	1454	2013	0	52999.92	3100.49	1000.00	0.00
631	1455	2011	0	52000.08	900.00	0.00	145.00
632	1455	2012	0	52000.08	2678.00	0.00	0.00
633	1455	2013	0	54100.08	3164.85	2500.00	0.00
634	1456	2011	0	64999.92	500.00	0.00	40.00
635	1456	2012	0	64999.92	3347.50	2500.00	0.00
636	1456	2013	0	70000.08	8190.01	2500.00	0.00
637	1457	2011	0	83200.08	2800.00	0.00	151.00
638	1457	2012	0	83200.08	4284.80	0.00	0.00
639	1457	2013	0	86500.08	10120.51	0.00	0.00
640	1458	2013	0	205000.00	71955.00	10000.00	0.00
641	1459	2012	0	51000.00	2626.50	0.00	0.00
642	1459	2013	0	61200.00	3580.20	0.00	0.00
643	1460	2012	0	56500.08	2909.75	0.00	0.00
644	1460	2013	0	61999.92	3626.99	2500.00	0.00
645	1461	2012	0	54000.00	2781.00	0.00	0.00
646	1461	2013	0	64800.00	3790.80	0.00	0.00
647	1462	2012	0	40800.00	2101.20	0.00	0.00
648	1462	2013	0	49999.92	2924.99	0.00	0.00
649	1463	2012	0	49999.92	2575.00	0.00	0.00
650	1463	2013	0	51999.84	3041.99	0.00	0.00
651	1464	2012	0	66300.24	3414.46	0.00	0.00
652	1464	2013	0	68950.08	4033.58	0.00	0.00
653	1465	2012	0	66300.24	3414.46	0.00	0.00
654	1465	2013	0	68950.08	4033.58	0.00	0.00
655	1466	2012	0	85000.08	8755.01	0.00	0.00
656	1466	2013	0	75000.00	8775.00	0.00	0.00
657	1467	2012	0	93000.00	9579.00	2500.00	0.00
658	1467	2013	0	96700.08	0.00	0.00	0.00
659	1468	2012	0	52999.92	2729.50	0.00	0.00
660	1468	2013	0	63600.00	3720.60	0.00	0.00
661	1469	2012	0	100000.08	10300.01	0.00	0.00
662	1469	2013	0	104000.16	12168.02	0.00	0.00
663	1470	2012	0	55000.08	2832.50	5000.00	41987.50
664	1470	2013	0	79999.92	0.00	0.00	0.00
665	1471	2012	0	40000.08	2060.00	0.00	0.00
666	1471	2013	0	41600.16	2433.61	0.00	0.00
667	1472	2012	0	55000.08	2832.50	5000.00	38812.50
668	1472	2013	0	85000.08	4972.51	5000.00	0.00
669	1473	2012	0	52500.00	2703.75	0.00	0.00
670	1473	2013	0	54600.00	3194.10	0.00	0.00
671	1474	2013	0	34320.00	2428.14	0.00	0.00
672	1475	2012	0	60000.00	3090.00	0.00	11500.00
673	1475	2013	0	79999.92	9359.99	1000.00	0.00
674	1476	2012	0	40000.08	2060.00	0.00	0.00
675	1476	2013	0	41600.16	2433.61	0.00	0.00
676	1477	2013	0	28600.00	2023.45	0.00	0.00
677	1478	2012	0	40000.08	2060.00	0.00	0.00
678	1478	2013	0	41600.16	2433.61	0.00	0.00
679	1479	2012	0	60000.00	694.19	0.00	0.00
680	1479	2013	0	70000.08	8190.01	2500.00	0.00
681	1480	2012	0	49992.00	521.97	0.00	750.00
682	1480	2013	0	60000.00	3510.00	0.00	0.00
683	1481	2012	0	49992.00	521.97	0.00	0.00
684	1481	2013	0	60000.00	0.00	0.00	0.00
685	1482	2013	0	157500.00	18427.50	5000.00	0.00
686	1483	2012	0	69999.84	582.72	1250.00	0.00
687	1483	2013	0	75000.00	4387.50	1000.00	0.00
688	1484	2012	0	49999.92	400.00	0.00	0.00
689	1484	2013	0	60000.00	3510.00	0.00	0.00
690	1485	2012	0	64999.92	476.90	0.00	0.00
691	1485	2013	0	67999.92	3977.99	1000.00	0.00
692	1486	2012	0	100000.08	1100.55	0.00	0.00
693	1486	2013	0	104000.16	12168.02	0.00	0.00
694	1487	2012	0	55000.08	400.00	0.00	0.00
695	1487	2013	0	60000.00	0.00	0.00	0.00
696	1488	2012	0	40000.08	400.00	0.00	0.00
697	1488	2013	0	49999.92	2924.99	1000.00	0.00
698	1489	2012	0	60000.00	400.00	0.00	0.00
699	1489	2013	0	64999.92	3802.49	0.00	0.00
700	1490	2012	0	90000.00	1800.00	0.00	5175.00
701	1490	2013	0	93600.00	10951.20	2500.00	0.00
702	1491	2012	0	55000.08	0.00	0.00	0.00
703	1491	2013	0	70000.08	4095.01	0.00	0.00
704	1492	2013	0	85000.08	4972.51	5000.00	0.00
705	1493	2013	0	64999.92	3802.49	0.00	0.00
706	1494	2013	0	79999.92	9359.99	2500.00	0.00
707	1495	2013	0	40000.08	2340.01	0.00	0.00
708	1496	2013	0	70000.08	4095.01	5000.00	0.00
709	1497	2013	0	67000.08	3919.51	0.00	0.00
710	1498	2013	0	208000.08	73008.02	7500.00	0.00
711	1499	2013	0	49999.92	2924.99	0.00	0.00
712	1500	2013	0	64999.92	3802.49	0.00	0.00
713	1501	2013	0	55000.08	817.16	0.00	0.00
714	1503	2013	0	55000.08	3217.51	0.00	0.00
715	1504	2013	0	55000.08	3217.51	0.00	0.00
716	1505	2013	0	55000.08	3217.51	0.00	0.00
717	1506	2013	0	55000.08	3217.51	0.00	0.00
718	1507	2013	0	55000.08	3217.51	0.00	0.00
719	1508	2013	0	45000.00	732.26	0.00	0.00
720	1509	2013	0	40000.08	2340.01	0.00	0.00
721	1510	2013	0	60000.00	3510.00	0.00	0.00
722	1511	2013	0	40000.08	2340.01	0.00	0.00
723	1512	2013	0	85000.08	962.20	0.00	0.00
724	1513	2013	0	64999.92	3802.49	0.00	0.00
725	1514	2013	0	55000.08	3217.51	0.00	0.00
726	1515	2013	0	109999.92	0.00	0.00	0.00
727	1516	2013	0	85000.08	9945.01	1000.00	0.00
728	1517	2013	0	49999.92	2924.99	2500.00	0.00
729	1518	2013	0	49999.92	2924.99	0.00	0.00
730	1519	2013	0	130000.00	4414.80	3125.00	0.00
731	1520	2013	0	125000.00	4245.00	0.00	0.00
732	1521	2010	0	74200.08	0.00	0.00	0.00
733	1521	2011	0	87000.00	13000.00	4000.00	177.00
734	1521	2012	0	87000.00	8961.00	0.00	0.00
735	1521	2013	0	90499.92	10588.49	2500.00	0.00
736	1522	2013	0	88000.08	1307.46	0.00	0.00
737	1523	2013	0	85000.08	1082.48	0.00	0.00
738	1524	2013	0	45000.00	573.08	0.00	0.00
739	1525	2013	0	55000.08	817.16	0.00	0.00
740	1526	2013	0	65000.16	505.86	0.00	0.00
741	1541	2010	0	195500.16	0.00	0.00	0.00
742	1541	2011	0	205000.08	136900.00	0.00	21.00
743	1541	2012	0	205000.08	0.00	0.00	0.00
744	1541	2010	0	128000.16	0.00	0.00	0.00
745	1541	2011	0	133200.00	56000.00	5000.00	32.00
746	1541	2012	0	133200.00	41158.80	1250.00	0.00
747	1541	2010	0	78000.00	0.00	0.00	0.00
748	1541	2011	0	82000.08	13700.00	4000.00	25.00
749	1541	2012	0	87000.00	8961.00	2500.00	0.00
750	1541	2011	0	57000.00	3300.00	2000.00	104.00
751	1541	2012	0	57000.00	5871.00	5000.00	0.00
752	1541	2010	0	30000.00	0.00	0.00	0.00
753	1541	2011	0	54000.00	5000.00	0.00	153.00
754	1541	2012	0	60000.00	2781.00	0.00	0.00
755	1541	2010	0	130000.08	0.00	0.00	0.00
756	1541	2011	0	175000.08	45500.00	24500.00	80.00
757	1541	2012	0	175000.08	0.00	0.00	0.00
758	1541	2010	0	63300.00	0.00	0.00	0.00
759	1541	2011	0	120000.00	12600.00	3500.00	41.00
760	1541	2012	0	139999.92	0.00	0.00	54125.00
761	1541	2010	0	171100.08	0.00	0.00	0.00
762	1541	2011	0	225000.00	119800.00	0.00	20.00
763	1541	2012	0	225000.00	0.00	0.00	0.00
764	1541	2010	0	140000.16	0.00	0.00	0.00
765	1541	2011	0	235000.08	98000.00	7000.01	106.00
766	1541	2012	0	235000.08	0.00	0.00	0.00
767	1541	2010	0	130000.08	0.00	0.00	0.00
768	1541	2011	0	259999.92	45500.00	24500.00	128.00
769	1541	2012	0	259999.92	0.00	0.00	38300.00
770	1541	2010	0	450540.00	0.00	0.00	0.00
771	1541	2011	0	450540.00	0.00	700000.00	60.00
772	1541	2012	0	450540.00	0.00	0.00	852.15
773	1541	2010	0	241200.00	0.00	0.00	0.00
774	1541	2011	0	274999.92	168900.00	0.00	35.00
775	1541	2012	0	274999.92	0.00	0.00	0.00
776	1541	2010	0	500540.16	0.00	0.00	0.00
777	1541	2011	0	500540.16	0.00	420000.00	59.00
778	1541	2012	0	500540.16	0.00	0.00	1692.27
779	1541	2010	0	124800.00	0.00	0.00	0.00
780	1541	2011	0	136999.92	45500.00	0.00	107.00
781	1541	2012	0	136999.92	28221.98	0.00	0.00
782	1541	2010	0	226700.16	0.00	0.00	0.00
783	1541	2011	0	255000.00	158700.00	0.00	43.00
784	1541	2012	0	255000.00	0.00	0.00	0.00
785	1541	2010	0	60000.00	0.00	0.00	0.00
786	1541	2012	0	60000.00	440.22	1250.00	0.00
787	1541	2013	0	234000.00	109512.00	10000.00	0.00
788	1541	2013	0	138499.92	0.00	0.00	0.00
789	1541	2013	0	91300.08	10682.11	5000.00	0.00
790	1541	2013	0	72000.00	12636.00	5000.00	0.00
791	1541	2013	0	62400.00	3650.40	0.00	0.00
792	1541	2013	0	190000.08	0.00	0.00	0.00
793	1541	2013	0	175000.08	61425.02	10000.00	0.00
794	1541	2013	0	234000.00	109512.00	10000.00	0.00
795	1541	2013	0	285000.00	133380.00	15000.00	0.00
796	1541	2013	0	285000.00	0.00	0.00	0.00
797	1541	2013	0	649999.92	0.00	0.00	0.00
798	1541	2013	0	286000.08	0.00	0.00	0.00
799	1541	2013	0	550000.08	0.00	0.00	0.00
800	1541	2013	0	142500.00	33345.00	2500.00	0.00
801	1541	2013	0	265200.00	0.00	0.00	0.00
802	1541	2013	0	62400.00	7300.80	5000.00	0.00
803	1541	2013	0	60000.00	3510.00	0.00	0.00
804	1541	2013	0	45000.00	668.59	0.00	0.00
\.


--
-- Name: comp_compensationsummary_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('comp_compensationsummary_id_seq', 804, false);


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY django_admin_log (id, action_time, user_id, content_type_id, object_id, object_repr, action_flag, change_message) FROM stdin;
1	2014-03-03 20:38:40.683629-05	1	9	1498	Burton Long	2	Changed user.
2	2014-03-03 20:39:00.395375-05	1	3	1	natedemo	2	Changed password and groups.
3	2014-03-03 20:40:14.642675-05	1	3	2	demouser	1	
4	2014-03-03 20:41:05.895871-05	1	3	2	demo_user	2	Changed username, password and groups.
5	2014-03-03 20:46:33.355359-05	1	9	1360	Deborah Turner	2	Changed user.
6	2014-03-03 21:03:19.44016-05	1	9	1360	Deb Turner	2	Changed full_name.
7	2014-03-03 21:27:25.073414-05	1	14	1	Skill	1	
8	2014-03-03 21:27:36.404367-05	1	14	2	Super Power	1	
9	2014-03-03 21:27:46.767876-05	1	14	3	Passion	1	
10	2014-03-03 21:29:09.802224-05	1	13	1	Simplifying massive amounts of information is a Super Power	1	
11	2014-03-03 21:29:43.736401-05	1	13	2	Project Management is a Skill	1	
12	2014-03-03 21:30:23.449021-05	1	13	2	Project Management is a Passion	2	Changed category.
13	2014-03-03 21:30:47.232677-05	1	14	3	Skill	2	Changed name.
14	2014-03-03 21:30:52.314535-05	1	14	1	Passion	2	Changed name.
15	2014-03-03 21:33:31.298588-05	1	13	3	Swiss Army Knife Coder is a Super Power	1	
16	2014-03-03 21:36:21.847776-05	1	13	4	Test Driven Development is a Skill	1	
17	2014-03-04 08:03:53.176958-05	1	6	1	demo-talent-dashboard.herokuapp.com	2	Changed domain and name.
18	2014-03-26 06:26:32.145627-04	1	3	3	paychex	1	
19	2014-03-26 06:27:30.913108-04	1	3	3	paychex	2	Changed password, email and groups.
20	2014-03-26 06:30:11.447895-04	1	9	1400	Armando Williams	2	Changed user.
21	2014-03-26 06:31:39.905475-04	1	6	1	demo.hippoculture.com	2	Changed domain.
22	2014-03-26 09:25:06.339154-04	1	13	5	Tough Conversations is a Super Power	1	
23	2014-03-26 09:25:41.197716-04	1	13	6	Delivering Feedback is a Skill	1	
24	2014-03-26 09:26:03.8642-04	1	13	7	Negotiations is a Skill	1	
25	2014-03-27 14:56:23.936764-04	1	3	2	demo	2	Changed username and password.
26	2014-03-31 12:57:05.056531-04	1	3	3	fool	2	Changed username and password.
27	2014-05-06 12:55:07.288584-04	1	20	6	On 2014-04-25 Amber Barnes was Very happy	3	
28	2015-01-09 10:10:17.944597-05	1	3	4	lpoliakoff	1	
29	2015-01-09 10:10:54.918271-05	1	3	4	lpoliakoff	2	Changed password, first_name, last_name, email and groups.
30	2015-01-09 10:18:43.113647-05	1	9	1362	Amber Barnes	2	Changed user.
31	2015-01-09 11:50:02.06098-05	1	2	2	Coaches	2	No fields changed.
32	2015-01-09 11:50:21.717154-05	1	2	5	View Comments	1	
33	2015-01-09 14:55:48.906939-05	1	30	1	Revenue Per Employee	1	
34	2015-01-09 14:56:17.111296-05	1	31	1	450000 on 2015-01-09 19:56:17.108769+00:00	1	
35	2015-01-09 14:56:49.394942-05	1	18	10	2014-04-24 18:16:13.971270+00:00 demo\nfnnfafanfafnfn	3	
36	2015-01-09 14:57:34.953865-05	1	3	5	bbos	1	
37	2015-01-09 14:57:59.197794-05	1	3	5	bbos	2	Changed password, first_name, last_name, email and groups.
38	2015-01-09 14:58:48.224823-05	1	3	6	mmuraca	1	
39	2015-01-09 14:59:13.208927-05	1	3	6	mmuraca	2	Changed password, first_name, last_name, email and groups.
40	2015-01-09 14:59:36.42839-05	1	9	1541	Harold Monroe	2	Changed user.
41	2015-01-09 14:59:54.958224-05	1	9	1528	Barbara Long	2	Changed user.
42	2015-01-12 16:47:11.272964-05	1	3	7	scoutmap	1	
43	2015-01-12 16:47:32.086936-05	1	3	7	scoutmap	2	Changed password, first_name, last_name, email and groups.
44	2015-01-12 16:47:55.589312-05	1	9	1540	David Lam	2	Changed user.
45	2015-01-15 13:58:26.865609-05	1	3	8	garyh	1	
46	2015-01-15 13:59:15.887782-05	1	3	8	garyh	2	Changed password, first_name, last_name, email and groups.
47	2015-01-15 14:00:02.854926-05	1	9	1536	Robert Wilkins	2	Changed user.
48	2015-01-24 08:55:19.550408-05	1	3	2	demo	2	Changed password and groups.
49	2015-02-02 15:13:29.311564-05	1	3	9	jmcclenathen	1	
50	2015-02-02 15:14:31.325746-05	1	3	9	jmcclenathen	2	Changed password, first_name, last_name, email and groups.
51	2015-02-02 15:14:54.284105-05	1	9	1533	Fred Henninger	2	Changed user.
52	2015-02-23 10:54:05.424568-05	1	33	1	show kolbe: True, show vops: True, show mbti: True	1	
53	2015-02-25 09:34:51.642451-05	1	16	10	2015-02-25	1	
54	2015-02-25 09:34:58.34773-05	1	16	10	2015-02-25	2	Changed is_complete.
55	2015-02-25 09:52:39.611571-05	1	17	1647	Amber Barnes PVP Evaluation 2015-02-25	1	
56	2015-02-25 09:53:07.142304-05	1	17	1648	Angelique Thibodeau PVP Evaluation 2015-02-25	1	
57	2015-02-25 09:54:37.557003-05	1	17	1649	Robert Lerner PVP Evaluation 2015-02-25	1	
58	2015-02-25 09:55:06.932898-05	1	17	1650	Christopher Dean PVP Evaluation 2015-02-25	1	
59	2015-02-25 11:52:15.167473-05	1	17	1650	Christopher Dean PVP Evaluation 2015-02-25	2	Changed potential, performance and is_complete.
60	2015-02-25 12:15:43.908901-05	1	33	1	show kolbe: False, show vops: False, show mbti: False	2	Changed show_kolbe, show_vops and show_mbti.
61	2015-02-27 21:30:56.960056-05	1	3	7	scoutmap	2	Changed is_superuser.
62	2015-03-10 11:39:41.474938-04	1	6	1	test-talent-dashboard.herokuapp.com	2	Changed domain and name.
63	2015-03-10 11:43:31.488729-04	1	3	7	scoutmap	2	Changed is_staff.
64	2015-03-16 15:10:01.966564-04	1	9	1498	Burton Long	2	Changed email.
65	2015-03-23 14:29:41.831545-04	1	3	2	demo	2	Changed email.
66	2015-03-23 14:29:58.02022-04	1	3	2	demo	2	Changed password.
67	2015-03-23 14:30:37.911112-04	1	2	1	AllAccess	2	Changed name.
68	2015-03-23 14:30:46.655735-04	1	2	2	CoachA	2	Changed name.
69	2015-03-23 14:30:51.635938-04	1	2	2	CoachAccess	2	Changed name.
70	2015-04-01 20:37:04.786726-04	1	33	1	show kolbe: False, show vops: False, show mbti: False	2	Changed survey_email_subject and survey_email_body.
\.


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('django_admin_log_id_seq', 70, true);


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY django_content_type (id, name, app_label, model) FROM stdin;
1	permission	auth	permission
2	group	auth	group
3	user	auth	user
4	content type	contenttypes	contenttype
5	session	sessions	session
6	site	sites	site
7	log entry	admin	logentry
8	migration history	south	migrationhistory
9	employee	org	employee
10	team	org	team
11	mentorship	org	mentorship
12	leadership	org	leadership
13	attribute	org	attribute
14	attribute category	org	attributecategory
15	compensation summary	comp	compensationsummary
16	evaluation round	pvp	evaluationround
17	PVP Evaluation	pvp	pvpevaluation
18	comment	blah	comment
19	task	todo	task
20	happiness	engagement	happiness
21	mbti employee description	assessment	mbtiemployeedescription
22	mbti team description	assessment	mbtiteamdescription
23	mbti	assessment	mbti
24	assessment type	assessment	assessmenttype
25	assessment category	assessment	assessmentcategory
26	assessment band	assessment	assessmentband
27	employee assessment	assessment	employeeassessment
28	assessment comparison	assessment	assessmentcomparison
29	team assessment cluster	assessment	teamassessmentcluster
30	indicator	kpi	indicator
31	performance	kpi	performance
32	pvp description	pvp	pvpdescription
33	site preferences	preferences	sitepreferences
34	survey url	engagement	surveyurl
35	feedback request	feedback	feedbackrequest
36	feedback submission	feedback	feedbacksubmission
37	customer	customers	customer
38	dependency	static_precompiler	dependency
\.


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('django_content_type_id_seq', 38, true);


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2015-02-23 10:53:22.859488-05
2	auth	0001_initial	2015-02-23 10:53:22.888645-05
3	admin	0001_initial	2015-02-23 10:53:22.931563-05
4	org	0001_initial	2015-02-23 10:53:22.981654-05
5	assessment	0001_initial	2015-02-23 10:53:23.065713-05
6	blah	0001_initial	2015-02-23 10:53:23.090023-05
7	comp	0001_initial	2015-02-23 10:53:23.132421-05
8	engagement	0001_initial	2015-02-23 10:53:23.17527-05
9	kpi	0001_initial	2015-02-23 10:53:23.205006-05
10	sites	0001_initial	2015-02-23 10:53:23.222836-05
11	preferences	0001_initial	2015-02-23 10:53:23.323142-05
12	pvp	0001_initial	2015-02-23 10:53:23.388836-05
13	sessions	0001_initial	2015-02-23 10:53:23.411268-05
14	todo	0001_initial	2015-02-23 10:53:23.458625-05
15	org	0002_employee_linkedin_id	2015-03-10 11:47:44.242444-04
16	engagement	0002_happiness_comment	2015-03-10 11:47:48.351192-04
17	engagement	0003_surveyurl	2015-03-10 11:47:50.950882-04
18	engagement	0004_auto_20150304_0935	2015-03-10 11:47:52.247953-04
19	engagement	0005_auto_20150304_0937	2015-03-10 11:47:52.534168-04
20	feedback	0001_initial	2015-03-10 11:47:53.902974-04
21	preferences	0002_auto_20150309_0836	2015-03-10 11:47:55.257305-04
22	feedback	0002_auto_20150324_1346	2015-04-01 20:27:52.97258-04
23	feedback	0003_auto_20150326_1508	2015-04-01 20:27:53.704678-04
24	feedback	0004_feedbackrequest_was_declined	2015-04-01 20:27:53.898635-04
25	preferences	0003_auto_20150327_1014	2015-04-01 20:27:54.014719-04
26	preferences	0004_auto_20150327_1016	2015-04-01 20:27:54.076972-04
27	preferences	0005_auto_20150327_1018	2015-04-01 20:27:54.128465-04
28	customers	0001_initial	2015-04-13 10:23:42.133235-04
29	customers	0002_auto_20150410_1616	2015-04-13 10:23:42.144073-04
30	static_precompiler	0001_initial	2015-04-13 10:23:42.172162-04
31	todo	0002_auto_20150409_1304	2015-04-13 10:23:42.257582-04
\.


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('django_migrations_id_seq', 31, true);


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY django_session (session_key, session_data, expire_date) FROM stdin;
vdlepvpberkl7us6osqcmwm9x56bbkk3	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-03-20 08:12:16.671859-04
qayuiqimhqx7x3dx7y5zwustrwo10bdk	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-03-17 21:48:00.767556-04
noggnd46cpxzd01x93t7z3tkmx185j76	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-03-20 08:13:16.133905-04
lonlo0cs481sl1n2aelsf6eznbbpha9b	ZWZmZmFkOGQ5OWI3Yjk4NzdlNmNjNDNmM2E3YmNhYzgwZGIwZDU4ODp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjN9	2014-04-10 11:58:27.594911-04
hawcyuxftb0r3lm1ysmw6xm1i9lbvibq	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-03-21 10:59:43.041714-04
jv02t7rrw8lef5s157pgaevef53o82yd	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-03-21 12:31:15.069829-04
umkz7lm7tssifq6mwc3ucnybdtw5rdff	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-03-24 14:47:33.940089-04
5j2ul1xm7w8giw2gz0k3og43l2s1q7u3	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-04-02 15:36:37.15518-04
o1091b1irnvluujrca3ybk2mykbaccek	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-04-03 07:31:40.400262-04
nvsuoozegj7zv91mgwwxx82c2gydt8x9	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2014-04-05 07:46:06.753672-04
ez3dlxaox7di51yejlqv53uqmm6w6sq5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-10 14:59:13.509453-04
9xot0b64x7k7q89vh4g4ku3o1tn4t23p	MmM4NDU4MTIyYTYzMjFhNTdjMDhkOGZjNWM3MjI2YTJlOTU3OGU3Yjp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-04-11 09:10:03.139829-04
4z197p4iql5j917770hpjtb1yorsp7qh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-13 18:33:49.522617-04
kpt4k25d39j0hvpkisy7h8pven8bq300	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-13 18:33:49.612749-04
r3ikstbtfxy1lhzklfylzk3ytkvqqgst	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-13 18:33:49.677452-04
cid1yajbtgd7vl3c6g9dbcvd4jcvgsl3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-13 22:44:33.716248-04
ps097xqjyjbrq985vs7ctl0sgk7wnb80	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-04-08 14:30:23.491127-04
7gb69j9nul8v6gxjojtlxwx47b2dok9j	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-08 14:30:38.642942-04
td8hsswvn1o4rf8kvfcwwxmihc4e2h2l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-08 20:36:41.068126-04
yt2kyqctarauuhcfjj53kwc3ntuar5t9	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-03-17 22:03:44.893178-04
u7bzmxtnq1kemby8vwzrp7r1pbiuguh7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-03-17 22:08:19.471248-04
hivdjl6jw24my95epd2ih0q0b90ad39o	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-03-17 22:17:04.181106-04
ove6xsg3u8mb737chrtvgmx845cw4wou	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-04-08 20:44:56.092044-04
d3zlh5ie1ustz32f1dlrcxefmp1i5xl8	ZWZmZmFkOGQ5OWI3Yjk4NzdlNmNjNDNmM2E3YmNhYzgwZGIwZDU4ODp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjN9	2014-04-14 12:09:27.310708-04
hcc6ml18kia9dj05ei6hstsuccbnnt91	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-14 12:09:53.69273-04
vyw42cwcb5zmv52cgyltzbwfilkfhs4r	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-14 12:57:40.312859-04
mw7i2ui6jjk0cf56qrz2tibmkblbca1x	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-14 18:58:11.656288-04
li85n62qviaglfqfkfm6wj4ddobcz1e9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-14 19:00:14.599494-04
i61bifrkh2kqcwicng5j37ecyapd7wg9	ZWZmZmFkOGQ5OWI3Yjk4NzdlNmNjNDNmM2E3YmNhYzgwZGIwZDU4ODp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjN9	2014-04-14 19:39:23.898998-04
sfefllsts027egqhqb3o3fh8l77zlyj7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-14 21:30:20.5786-04
5he6y5zwpya93rjr4g77js2zwgzlyg8t	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-15 00:11:29.169402-04
w6ukm8br14lzeusfvlbgurdwt3fbyqh9	NTlhMWJhNDEyNzNmMDMyZmZiOGI1OTE1MjBlNjhjMDZjYTIzODhjZDp7Il9hdXRoX3VzZXJfaWQiOjMsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-04-15 14:14:23.71767-04
8o3mhzs8k5isw3fyzjt23y7ypuny1uyf	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-04-16 22:37:56.680433-04
5q7oxt1lyqdcsk2ltand4ax9cpr6eyh5	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-04-17 10:58:21.544024-04
neifayiiv560mhoi6006lgcsx5bkjxhb	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-04-17 12:30:58.059654-04
d5ub5xbqj1hgx7wnmene02y98ham29qc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-17 12:32:16.903941-04
t3fjiwnpumqrdpz3gajjaj7iuaj1myax	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-17 12:35:48.867728-04
jsb9cfz58nho548dwzm42tn9uplkvana	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-19 02:47:12.925587-04
1vezp178qcdwglby12k9f35qy1o7rom2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-21 18:43:21.133216-04
hny84n2066jmmwv7ngaopjhzn34nba4x	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-23 15:32:27.494516-04
j17349cfc4rg5chjc18dxm63y3aezfli	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-24 15:39:13.56069-04
ci43vwf16lv2u2d4jp40h4eky6gxmpxl	ZWZmZmFkOGQ5OWI3Yjk4NzdlNmNjNDNmM2E3YmNhYzgwZGIwZDU4ODp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjN9	2014-04-24 11:05:19.140374-04
l0orugeohn1dz4j2h3ya7zgjfejbp3pe	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-24 15:37:18.561416-04
ygltjpjkaji24uind8xrsuzibn96x6w4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-27 09:43:46.691655-04
03ep4inzicgo6s1pzqe86jsqv87197sn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-24 15:37:19.527125-04
c9yyymjbot4mf3awrw27013jwm5ryg7q	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-04-30 10:30:15.232776-04
jmndfdbzmrpnswtsah3hvihz89kp5zge	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-24 15:37:20.29236-04
pahyamhsts5qk5j17h3cyqnwvwdf3l1c	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-01 16:53:08.783117-04
t749t42t30eolw90wzwm3emfoj13itg4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-01 17:26:03.809101-04
50wxx4vlvvq5hax7zaq77b5ckberuk1q	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-02 04:39:10.89255-04
y4sx3a8gaw821cbb3xnkk55j5raxs1hx	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-02 04:39:13.073201-04
u902v26zbqwmysi1ssxov7nbuhjsdgpv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-02 20:45:10.068621-04
9hwqri4zw35mqaka85k3t43kuu9e27e8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-05 01:38:13.912755-04
8h3x30wx93eys4tkvs5zh7c0z32jtd80	NTlhMWJhNDEyNzNmMDMyZmZiOGI1OTE1MjBlNjhjMDZjYTIzODhjZDp7Il9hdXRoX3VzZXJfaWQiOjMsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-05-05 16:04:32.766723-04
ysdhx3qa2biieog3aci4l4ktdlv88g36	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-05 23:23:34.69006-04
liz78gsrm9s1gbcdcu617yz2zo0op8cf	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-05-06 10:20:18.399355-04
5f79ar723l4ur2u611avurxr9vjxfr8d	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-04-24 15:38:51.368294-04
ncjurf9190r9fq5794va5ljkkcg2qybi	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-05-06 12:30:37.734373-04
bl6vohoyi2baehs14qkkgfbo1rqj6mpi	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-06 14:15:32.030387-04
o4ckt1c6w4r8gh9ltby3hr6phiuuntbs	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-05-06 14:33:08.558964-04
a4iap3jrpyg2hfxup6l6eptb13ids920	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-06 16:24:04.988588-04
joirjnzajdzqdmlt1n30pzy339v7zjhm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-06 20:34:01.509233-04
6zgg6vhpr178ttx9bhni3rwuv62xovsg	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-06 21:30:15.041996-04
le70p80k96nbs1d8u7in5d4soc1plblh	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-05-08 13:49:37.5645-04
bo4vz03oi3vwhq644ka6m93a7ndi6m1w	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-05-09 09:50:59.656197-04
pbxnq88clita7dz9l8qv58usyuegueyu	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-05-09 10:03:19.867288-04
18eddcz1l2bq2llmh4zl4nh8vyj78li0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:14:33.385746-04
09fkx1owvllwfqu8fwg8w2jg666v0mf2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:14:33.475178-04
d4rqjn2varj37fa58llvffzicagl5dld	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:14:42.788559-04
7ikescrcnfeyk1meci2d4w8lnju6zqjl	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-05-09 10:15:36.215044-04
fcvcovv2y9whrnqkhxkxycpq9se01ebg	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:37.499788-04
rl5u9h7gnomqevrctovo6zxcz1ua3kmo	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:37.835825-04
hpou9utirp2psusjhe6fduxm6z2fodx3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:37.907486-04
2figjpolacbsabu8gtu4lpknqjl56pm2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:39.387045-04
6p4r9mvja060qbb2fsbxompql16s3x4l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:41.400022-04
qwoao70dq2xrgbvvm1iisa153r18iaui	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:41.487971-04
7pu2vvm8tu3vdk2twqiyx7cmeko3bptq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:41.71411-04
ci2dgriwj2huptpm6lpl5zsm2bajl0kd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:41.780572-04
wc764tv1q3dm9ps4a00hc9clxif6kvb8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:41.947984-04
upeppnfdtmoioptdaujse3uym3ylnezz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:42.556864-04
5emf9e9q0oybcy04hx37ucvazccysw09	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:42.627555-04
10zl7agu1nwqjva9htv3ec0sxvelkbbu	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:42.693547-04
3i2j0r0h9rl19du6krnt4t7vnptuinrg	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:42.756671-04
bsn1uepkfeis7ryw68l1013of0wq14ur	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:15:42.825732-04
q9vxw0wdcdck6eyjqoaxnj18gkj790xu	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:28.297257-04
2dwg2yjabcipv1sa0vth2qxtvh35pfud	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:43.971875-04
z7ruiy6nxm5bmjs1sgeso7h82pini5rb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:44.063948-04
ne0o5mratre842c9jlsu9eho6rcfx2dh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:44.134684-04
9nuuogu85y2zieyqkk29owg6nmv7d718	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:44.194867-04
1wfdi5a12in6v5rn8yxqu3m2aenipnh2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:44.325171-04
c2ef67phieewlst1p4xay8hxa7pmqa12	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:44.887779-04
7yvo0chrsxsxfmktvpnos9mwjp8kqtum	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:44.952981-04
jcd6zc182b1dumob5jkrr1skhzsfpa3k	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:45.194245-04
satm5thevpdxu995qe86j56wz1g0e7dw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:45.249207-04
2psrd8ld8zmbh3qxye2uw6fad37bbu2r	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:45.387773-04
8h8pe18qw7ckzyv5vtbtgw4emyqq1jpe	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:29:45.44807-04
txuody3z7m0miawwkp92rbwg8ae7nrcr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:34:01.119545-04
elp199ocrtlwhc66hq93qlhnhodjmfmk	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:34:01.207758-04
419k3k277wmei2g93maiy4znfljk2ixl	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:34:01.627021-04
i9j98jcygnoo4bvpujpnt55hg5ba2wk0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 10:34:01.710583-04
lewh0nrel55kniigywz70jbuql5exopo	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-04 12:51:06.925944-05
02ws9ag9zgb0s343joqqznat5r9no7ig	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-06 03:07:02.429264-05
jlrm5fh3a6z2u6ftz81hleoivdrvrgj8	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2014-05-09 13:18:11.315096-04
8xi44eutx8ftmgdb7f8mtr8mllajshl1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-09 18:23:50.424078-04
4fwo99j6xoxxh07hi7y9vkvm9rmzbogw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-11 06:22:20.737363-04
1cdaovj33lzncpzflke9vmh01nh5gfw0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-11 06:22:31.043182-04
t4olj4w1y6my92r2pv3ilkmsvi7u87hf	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-11 11:35:21.106388-04
ik8ecofl6mwl1ynh391y00hdwapx8en4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-11 19:20:37.438443-04
5w1x1acswn88zcajedeppib4b3rk4mwz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-14 22:42:58.57262-04
0paccrzmnj5ps9b7if0hfdsasm68y71a	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-15 18:11:42.777038-04
l48xb3uhlbu99hhjd67e2c54c5msheqt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-18 12:17:10.581401-04
ns2anurpjjlewbar1ely2tdmkkhur60o	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-18 12:28:12.141838-04
iopjrzo1pabe07x7ecwfan6c7crg32zg	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-07 13:49:49.315228-05
ia18jnzcbxrou9chniwa9m30xrs3zrey	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-08 08:00:56.651882-05
b6gy314pboqdf2n5vsw21oznyi8txqfe	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-08 21:13:56.817704-05
a2ok37j8t815ndfjazq1al1f6z1lsy47	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-09 04:10:55.439345-05
8proy591hyjjkrt79wn0rz32u2oqvpb5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-09 21:46:37.417043-05
7atyarnjg1l89vulowmni5e0fnhdm65g	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-11 00:21:48.497262-05
lbtrg0ngcizplcnnw2rekb71uhbvomh1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-11 13:26:26.160506-05
73xvkiy9lc1lxk0kd3vxaadg7bfgaegz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-12 00:55:35.699077-05
rnq9v18bwq046tuzhi2h2bwab996sq3e	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-13 02:24:26.703652-05
lkycl266h95n59okwb2vbcnhv6ho1h9m	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-13 03:54:36.853947-05
2y8ubcyxy21d11zn6noi8oa9prcj2de3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-13 19:59:53.113675-05
cmasgb5w4b5t6r9bj9a3sc4kmile3w9v	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-14 15:06:06.336873-05
0sq1jbelafhog3poeqi8d8pr9rve45cr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-14 23:48:16.617882-05
rputu42m9gf165k90q1fn7xtenwt1534	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-15 05:38:26.934303-05
2z10nkpl7vm6orleqkk0aw2u92gw745l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-15 16:49:13.328613-05
1ck1ekv9wkrebwfrnmmtxkm1cova7i41	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-16 06:45:23.768197-05
4h3eotjt248jq2mj5b752hdcqdbzcofu	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-16 21:58:46.45508-05
x6x1ejejcn080xfrlmntq5nfqut9fgas	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-18 08:13:40.98991-05
foi97l1xh5vvwp1q4odjqhhrt7281ptc	MmM4NDU4MTIyYTYzMjFhNTdjMDhkOGZjNWM3MjI2YTJlOTU3OGU3Yjp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-05-20 12:53:31.137944-04
rcifgcvxezx8gbx3eg27de7kaeuudn2s	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-20 14:56:55.699381-04
v4rso9kllxcnm8uh9ira6qouhp7aovu2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-07 13:52:10.283273-05
2yt63ynlhj06z3clhlxa6t1k3hdcwe43	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-08 08:06:47.120956-05
feeuup96wl05fzf4to8fxvmq6j4ujj9q	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-05-20 15:33:43.352345-04
2v9due4zzqry04go5lpgn04rnu3ovguj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-09 04:10:57.77232-05
wcsh2louxazi0b6ahpas9a2hrqvysujj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-09 22:30:55.663854-05
axy0lfu0bajvhqbao690ww4g25ul50zo	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-05-20 15:40:17.03861-04
dfv5k055hbm1crluqgln7gaooco82k1c	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-11 00:21:48.694125-05
6e3s3vrk9gotp0dgakgioi4yz1euxbtd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-11 13:26:57.386464-05
zjxofztl7injx83oegnm0ikczbw78xxk	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-05-20 15:42:35.876956-04
efsdnmwt1v8zdadjonnpjtrkd40atio7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-12 00:56:25.348883-05
lq1offebyl4ytdr0m0n8xkula7e6pxja	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-20 18:33:38.166707-04
cd4kzh1zhbuspgogdrahhom9p08mkq22	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-20 18:33:40.967887-04
enbncww63flb1hb95a8bhmhvpmn5nt5g	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-21 00:52:38.771127-04
g2336pjezsn0129v8mpwg40yvwpaold8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-22 05:45:28.020868-04
r9n8quccv5yq0vvzpo8fgqn23o96x0er	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-22 05:45:30.693036-04
xjairgm2cjpbago5ka3qiynyn31g8jcz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-22 05:45:31.215853-04
g4mws0pqgflw61cfbhfg75bma8b30rvk	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-22 05:45:34.268375-04
oel0gc0bnvg7b5gogm037oi7oew37ab0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-22 05:46:02.969201-04
qnrczkytspaerllkvyspsp62htc1kv9e	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-25 10:18:57.139772-04
yexdwa774s91pouv5b0dpc4ecbw21qry	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-27 18:03:20.70309-04
jbfumv3hgdrwgnpj22ci8rapcjpw7324	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-29 10:55:50.512319-04
2o24j9719dzw7ze3u7zmull1y46fn974	NTlhMWJhNDEyNzNmMDMyZmZiOGI1OTE1MjBlNjhjMDZjYTIzODhjZDp7Il9hdXRoX3VzZXJfaWQiOjMsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-05-29 14:00:40.951245-04
hpnsrfl9ii240vmwhri57rl2efxftdvv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-31 16:00:32.415882-04
6bxd614h3degoamy5hjbueuh0x89igr4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-05-31 16:18:56.661988-04
7x3g1alw61q6trlhh91yinurbo0or3xs	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-01 15:52:51.775497-04
j4ilixzwjajwzy9yogxz1yjjjkt779ov	NTlhMWJhNDEyNzNmMDMyZmZiOGI1OTE1MjBlNjhjMDZjYTIzODhjZDp7Il9hdXRoX3VzZXJfaWQiOjMsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-06-02 11:47:22.030659-04
wqwb4ljvfg41wsy25vvl98or42bkqogt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-08 16:51:21.107859-04
hnnlf2kk4y6c07cmurrzjpkfiv9wj2kz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-12 02:38:38.875394-04
go5wr5r3mlgqky1jfg1x4tfbvkx96qhd	ZWZmZmFkOGQ5OWI3Yjk4NzdlNmNjNDNmM2E3YmNhYzgwZGIwZDU4ODp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjN9	2014-06-12 14:42:15.321681-04
2x9o8k25rnskzo4qqqi5u1ft8yzkl2ft	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-14 17:01:36.167528-04
5tauodbn6rs5ie96y47zdptu0anmd81q	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-15 14:34:38.353208-04
zp1m8razkdltmcd9x6gq79qoh7mv7yv3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-16 13:27:14.682822-04
ibheue0pvy6ecni4uzmsdjgg5q10bu1s	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-16 13:28:19.765216-04
6tlaven8nnfmj1lp44m5im8vdcstmmep	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-16 13:31:34.235232-04
8q68mhewge0chvfe3kh36ysyevg7ywgj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-17 14:54:30.300303-04
ihjjdsc74482hmmj4ag8ne6a2y5mf0ay	ZWZmZmFkOGQ5OWI3Yjk4NzdlNmNjNDNmM2E3YmNhYzgwZGIwZDU4ODp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjN9	2014-06-17 14:58:00.444464-04
2pie69wgl6ptiqrfshd0ers63ttvei99	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-17 20:31:28.090294-04
fjft7drsjalwu61zzm6p1d03yx42b45e	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-17 20:31:28.186742-04
o3boxvdd36bxtgl15a6l94wz1yjdfbos	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-17 20:31:28.312838-04
tdlb1c0zxsjxrm2r64r3c5kocynmn55v	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-17 20:31:28.403099-04
yjhkyujs4s87t08mgkep9dcxt9fbym6c	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-17 20:31:28.465693-04
udneoaqdt9y2vwkpx0pjjydvx08u2l5l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-18 01:27:14.95823-04
vag5jnlv3pi098zn6uf03iy6ladf1nub	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-18 01:27:29.027706-04
ox0ol7nuwsqq0k62dql5p0ivk8oaau11	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-18 11:57:10.234123-04
i8z5rydwjs1gh80w27c9oylfitx6q2pb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-08 08:07:10.380319-05
v3uo0rckrtl5m0md1glsrix48q5y9ivz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-09 22:30:55.820077-05
po5uh9iehn13o8u0qj2k7qev5bc6qcs4	MmM4NDU4MTIyYTYzMjFhNTdjMDhkOGZjNWM3MjI2YTJlOTU3OGU3Yjp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-06-18 12:02:50.992805-04
waavqb2zjaiev6rb4itvwk5uphs9o1pm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-19 08:26:38.709429-04
p4el3xlecz3gzfxcu5301ihoqssq3wko	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-20 18:51:46.784293-04
ahc4bi5hzl307d0a0p8ar1v4jk6omo8j	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-20 19:30:01.187181-04
qfkftuc3nbw067uu5859l1qqx0x9zba2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-20 19:30:01.444749-04
2lgqel9xargwb1st0ory1ixcha08zr0k	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-21 09:37:30.910332-04
8wj8wy826ro4u2za7wq9cncvkrgtezck	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-21 10:02:16.355262-04
26u7cx28ab17id6v5shccmlu4s7j3yuy	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-21 10:04:36.928908-04
d4xzrytoj03bntc5rp3vbsra879ebfge	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-21 17:46:16.859922-04
mu0dg0e74v5o02i44y8pk2ak2cvp1j7h	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-06-27 10:46:46.007911-04
s0bjmalgi31u7zh0oxa94q7q7lc2zasj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-01 17:06:18.622876-04
2nik0p3vsphcu0kq9jbj44zy4vkwshia	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-01 17:06:20.749552-04
gw137snjjx7burtwqafcxn9yn1h7sia5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-02 21:11:24.193639-04
wndkvqskc4nloqvumcbrvt9i72nn6t5t	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-02 21:18:26.987595-04
mnykpgodxpi03born3crfzizxv4dosml	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-04 02:47:33.526483-04
xy98m2x77imq5zvxbb2kc3engkwj1x53	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-04 05:02:17.306535-04
h5br0qyz9xtgng1e8cbitmjo0q2iao43	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-07 18:53:43.078734-04
ilblwgaho4eidwc9tdyekajr3ynpbmd1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-07 20:13:50.029342-04
rqv2qgtb3vhu184kdc5ps27yg76lvd1l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-08 03:59:08.653767-04
bfoz4ds8k0eulb0bbel9hbjgyjf0blpe	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-08 03:59:48.849105-04
xo5h8l4arqgxmbgmp80wjk103sd8ij5m	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-09 20:42:47.058319-04
l3i3bslr0qhq54z1xv0jr4bb3idddc8o	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-14 22:35:12.123668-04
tyjztgr29n71pqp4qui476y4n8ji1lxi	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-16 01:10:38.248806-04
bwsnxovm1n1p9b3a9y5k5osgr1202qac	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-17 12:33:58.822685-04
o777p015hs7kmhyu1alfc3d9n307rlyl	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-22 16:07:00.842329-04
oncmti2f4o66wn7nv8ng71iqztxq3l85	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-24 10:43:56.710407-04
hrb6d8d8658h0qpytjl3h0ad51lssfhu	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-24 10:44:10.093882-04
1ohv8scyrchp4ibu2ssnfd8q8qgss5eu	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-24 10:44:38.263265-04
0c54njb3lvn33x2mgefdabhx4w389hps	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-26 19:31:35.584103-04
9lak7p3chc8s8wnz83p7ihj4832jqm89	MmM4NDU4MTIyYTYzMjFhNTdjMDhkOGZjNWM3MjI2YTJlOTU3OGU3Yjp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-07-30 14:02:47.891066-04
n1263o30mxdq8xft5z7lysc18nk7pxte	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-31 05:27:52.231904-04
ba5ee1b77rntwivqltywej9ztw8u35u2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-07-31 05:27:54.351625-04
yq178uz990ku1zwml70xjql7t1p3jhua	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-01 16:41:16.332345-04
uvte0ay9mm7x0ku41krlqdf9rvz0juic	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-01 16:41:18.969442-04
jrag5mpzhhm2lpatdkkihqeobbgnd2ej	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-07 20:24:48.277546-04
7ljjcav7uaq51bklf1i26v3vbcv9aypy	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-10 18:42:01.764601-04
w0egmhqahil3qaycvxbjmx5ssancsrfl	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-10 19:34:10.707375-04
mmo11p7o8a4ei6mt0t4esgyokeklwo7e	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-11 05:23:56.52738-04
4v4cmlhzjahgq11sbqkhc7bfnr3ddykl	MmM4NDU4MTIyYTYzMjFhNTdjMDhkOGZjNWM3MjI2YTJlOTU3OGU3Yjp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2014-08-11 13:50:21.928471-04
tz5qnq8saa7eb6g0mi7dk9kc8rxxirel	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-12 10:42:04.294041-04
jow1k33aw1cgsmh6jtayg9xo5p7rs0dr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-12 10:42:04.461167-04
xzn1a00f79x9lurshpdpbbk8akfyde30	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-12 10:48:34.974877-04
zuzqb1ab4uydzkl22qsnhux38ssscj5q	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-13 05:42:49.439234-04
so5rpu8rhdrvp12hit83odsx2vbspk8m	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-13 13:24:44.700459-04
lmdqsoy88hvlbkikkon6hy2wv5m1sysc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-13 13:24:56.537793-04
oqh2wy8roxmyr4p38qgvbom0mlv8mt0c	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-13 17:42:02.005035-04
qwubdzawjwdbh6ue717i2rrkrfqzolb0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-13 21:46:12.999552-04
vg44iom2uqkqvzxzpmi025lswqhjrbth	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-13 21:46:39.336816-04
ryz6mbrt67je5zg5eots6mzsc5ntygrc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-15 15:54:12.485452-04
yl5mmalqulke1gfg3kmop8r3p3l6is9s	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-15 15:54:12.740098-04
etwqqxpcyzpmhwitp67ypqbyy0jn966w	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-15 15:54:15.174432-04
zhm7t89ijn21dw6nxgczml2158w9mftx	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-15 15:54:16.433372-04
1gp44uxgtpjvuhpypgg3i35d8w3h63i1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-15 15:54:17.691069-04
aa2pn8u2sgpjqf6ock7tv0vl7kxvpgjn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-16 08:36:37.79111-04
633wgl2b263g7n4ej08tj01ocqbdswzy	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-16 08:37:24.790922-04
xjy4ue5k8bvu0iu8pmtkfpb1ibc8x6du	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-17 00:26:10.294461-04
pqe1uprtyy63as6oeocpkh01xmh9we4c	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-17 00:26:13.544494-04
0c7nwbjpb1hddvrl9iokbnsma6w0bqec	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-17 19:26:02.107292-04
xyshexkglhfzdhwvjyxjsg3advjpyx6q	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-18 01:09:46.326218-04
u77s6bwyzncgvxqztkzzn3rr07z8yo0p	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-19 08:40:08.509258-04
e1cbda3j1x9sfhk1tvmavuv4euhdctwo	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-19 08:43:00.293005-04
vihbmsxji4v2i0qs8cd6lv65p8yqq6h4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-19 18:05:23.753839-04
evm7kwpiwbosyi6yptvtagpawrgmi2j2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-20 00:29:31.724003-04
djeev9vemth011dc29gfs5obe4g7p3h3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-20 11:33:09.806389-04
6ij25vd9qha3q1k8i935tlvnqzyzme0u	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-20 11:33:30.256914-04
pyzhvx1ae31j7vv2u1n8r02n9e69jepw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-22 08:43:11.284331-04
bow0grrbn0hh51rbpofrvitkrye91ub4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-22 08:43:12.064773-04
angwd4u9oisof0h9thtruqv0nj5bz9t9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-23 00:42:24.189328-04
ieuzc7ii9bbhwml755rk6092vvn13e57	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-23 11:18:07.764119-04
8sds5r582p4irmxa3s91gso9uvzkh2ti	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-24 23:56:02.778217-04
qniady2ejaq8isnhe7sen5ut3qheynrg	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-26 00:46:22.739647-04
njb85fa2n4ymimzazc6571ughb5lejii	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-26 00:47:08.837953-04
yp8deode6bm7pjh6hy2dd2gvz3f1450p	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-26 18:02:13.081333-04
opcmm8a5f22mlmb9koo86hm61w4zp4qm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-26 18:02:16.056684-04
u1e4bnlnnwvv324x1c6iwhvohlgedki1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-26 18:02:16.564829-04
a720hm1ttipqkrfgdm1bcew1eh94gjwp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-26 18:02:55.106778-04
6ue90wr6qnv8j4wbfj6i631oximhze2q	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-27 03:10:43.625136-04
9pwc7yw66x07lmhjapq0u5w0oq6cyuj7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-27 03:11:56.579841-04
tzli02jzkedp41x03zojcwacrli5os58	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-28 07:42:05.005203-04
q9tum03rmhejia4kdw856kbb01nmzkt1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-29 04:27:07.682993-04
xcv1sji5azfwq8in12f416mbwyu7sq00	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-29 04:27:14.953468-04
fgcufv93qdlb3xh8eqvv4v911q0fiogm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-29 06:41:12.35618-04
wft5t9zfykzuphwzgf1o5tonxlchsilr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-29 15:59:54.17407-04
7sim87o7al6ydnefzt0vp02lcynp90ka	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-31 08:04:01.203739-04
0on9ii0js6we373qbs9lkrqw4p1gbezx	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-31 08:04:03.343626-04
qibquuqsa614e508bkwbu30a2cinxcaz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-08-31 19:29:26.520732-04
f0xghpe52gw6bue4v1d9nr8uc0gqqfqx	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-01 06:12:54.602643-04
x0qzt0u4xfy8z04wk5qifv1mgwmuopw5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-01 06:13:07.092839-04
yb33w0egdag1tizoyafnfhyjdatlzuw9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-01 07:39:56.698849-04
t605jnzimymts9trdyiavyf0fp5eqyjj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-01 10:54:00.711535-04
i4ftittptwdkp3h7p0kndl8uuz0x6g14	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-01 10:54:04.976557-04
mlnkcarvv4htt4uj0k4c0ic2jsd97be0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-02 05:15:07.948924-04
tljqrn6o5nlr8iurfnc1is0q8nfn123i	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-02 05:15:10.414666-04
w954fwybw4s881fhqirksciatxnpahlp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-02 20:07:15.25677-04
quub1klsau9tm2v8i4l8y7jz3948kw61	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-02 20:08:02.042059-04
1sjk3drb9py0wh8ujg7hxai78rip4ac3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-05 03:14:26.694295-04
hy9nj0ka1ron2savx26sbbxhs3c1p3sw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-09 22:14:26.001314-04
5thbq0y5ywcs2cya6km813mgw6bem2an	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-10 00:06:19.798754-04
wz3f9kpdx0cb3olenr0fgbrdigbolugs	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-10 00:06:32.335542-04
6o0llu3jjukhpiyqb0d0cvprxarsaxej	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-12 19:16:13.25486-04
l70ugbznkx5qwm09mke1tjeeylxrliq2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-12 19:37:57.468727-04
eg2unnro7hvav505hyof3dom8633i23f	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-15 22:34:42.468129-04
c90pt51cv15pmm8851iq3sytjhv7dpf6	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-16 16:38:00.103198-04
jdxt6zi10qo49yluors5qslurrfp7wqx	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-16 16:40:15.830251-04
q82nje2272kwaqadzwszgnd4jjsebeer	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-19 05:03:51.816047-04
4u11mux6l3odp3d100dj1ev8mscwnuw2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-21 04:23:35.48393-04
wnj9ootxl3w0w6e1qaurzfijvkk5a04y	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-21 04:23:37.813241-04
a5oi7f4kqpv2pgm4y0nmfzyttibqkvcy	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-24 04:42:17.116432-04
ji830ybg6qe11uockhcincja9iou9gdh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-24 09:14:00.43243-04
15vxann87q33zhbp36rpo9fejbf0h0q0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-26 20:59:12.674754-04
hcxtrk1tzttpflllnkauva17vhngcrme	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-27 05:15:44.172647-04
wodg3bem15uw5kevatgij0nf1rzcm1i9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-27 05:15:52.739784-04
6e2lqdv7v8t8ex6vn3qv656vb7lopxpr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-27 05:15:56.947095-04
nwlel7fnyhqqo87koqku9rldxfvwygxc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-27 05:15:57.252892-04
r0y6nturnkxp1tmhzufrpdujd7ihotkz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-27 05:16:00.971708-04
40u2ibsu9enk00jp36312havb7eu2qnq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-28 07:52:16.541292-04
uujo0h7xccx9q1w594if3qc8s39wq7r3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-09-30 11:55:17.255923-04
daplb8mt500qkhe6eg9mtd6o36dqcorb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-01 02:08:50.327362-04
mu1iy709wrnsammcdynklz8fzsgnqvhn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-02 07:08:25.22511-04
er5ytk4g7z5483mrh1zs6f7reej7vezy	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-02 11:08:07.908921-04
znlyuoxfa3htwe2h0bkjgpzco0jxb5sn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-02 11:08:10.036401-04
0coh1jbk22ijdoxygot0d4g38qywkvm3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-02 14:13:42.228603-04
td2d84e8v6x8xmgyeub061rxjmwo32tz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-02 18:16:01.673506-04
hp1seghhyl7u3n0c61azyrkm01zx0oic	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-02 19:15:40.252356-04
ce3ppe57byqs4d0q7bw9r6k7fvyao9jj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-02 19:16:13.34071-04
7g21uc9olp09d76nspfbnfw2alv2xtz1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-03 05:52:48.685283-04
4lzzj2n7n9juoeep9ezpl06ixf5dikah	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-03 05:52:53.686135-04
v6toy47k9an2iz3i43lqwkvn3u167cue	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-05 07:50:50.327473-04
nmc5ijzgo4yb8bexj0cpsaqg006vmnn2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-06 12:12:52.313383-04
8mmuvt4baeoogu5ijb200y5gb1hz02ry	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-06 12:14:29.825427-04
ren5441hs4jrpvm5y62z0jn0gz69yw8a	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-06 14:00:27.679439-04
5unduvyy8p2zx8wkbrslofczhfistigt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-07 12:28:18.248939-04
7jp49oe8kc7q9i1m4t3nv3e5q6dxz8u8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-07 23:18:53.533823-04
abbkdbn7yo59f2ekgqy4qe0r26jqn5hz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-07 23:19:05.675273-04
150g0b8x5zldfe38zpiab78dmnfkzh1o	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-08 21:51:55.43816-04
igogxn6lax7vv9cetyy1n834cdnobjmv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-08 21:51:55.623892-04
fa0kdoofokbsffr8fkgdq5lbl5ywdrcs	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-10 05:13:37.132103-04
g0dhxureo21bs8zemnuyy5fktoeikai3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-10 05:13:37.260549-04
m3u3hxse4zno6nrip8zluxmicmwfk6y0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-11 00:12:29.059404-04
cxciw8zjcqiv10jw6w87vzt6h7ww2rhv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-11 00:12:29.177921-04
mybufy6i745ad33jfxcgfeo8tbyz4goo	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-12 02:11:38.519864-04
dykt1nfgh1fsyj8y7rqrrar1e7sye79e	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-12 02:11:38.628298-04
ry940dv6sugjti2m4ijiu4zwuq67b96f	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-13 06:40:59.080512-04
b4zhxk74cy5s9gsi80e5a6z3jdkiavjn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-13 06:40:59.220853-04
ga9ql10gpmkqlju38w5m17sawq7trzxh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-14 02:04:00.206425-04
2qrcl5mhe1lhcnr4y18j0zwr251q5q68	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-14 02:04:00.433476-04
1x5uaqqpqwgrd8s5skoky60dojgkv92r	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-15 06:47:52.384485-04
xfq20kjo5fq17dgin99suywjhsuh5ewn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-15 06:52:36.900477-04
htkb3zk7xoyz7yuql9a10jgnclwnyyua	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-15 15:30:16.608924-04
v43mjqwynw8qtid8ptt0flv13ypmukwp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-15 15:30:18.553205-04
vcyywetzdgqht5l67hryc20ahyqa71b2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-16 02:40:31.395028-04
sj2m6dygm9skap8h2jyont0x13gfovtf	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-16 02:40:31.536007-04
f2gyt8x6j5pwqi0yc863vx6ohayqx4g6	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-16 13:14:30.240663-04
d7daimdp7m7zmj9rr8nms6b01yryh0zd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-16 13:14:30.477085-04
85tduc63bp4ll24i18599mvvykvmezka	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-16 17:19:29.476839-04
ihhieqohzto4ei1swuyljvwssvcmisxz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-16 17:19:29.646427-04
jcnejen6fgy4quo0k47j0dua8b70ca1v	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-18 06:06:11.475287-04
qti2pbikyuyw3oe7v6f4skhw52vv6el7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-18 06:06:35.938963-04
af59q2k4b6hv23a1eforong7bcyt065k	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-18 06:08:26.718367-04
kv8yyni91dwgwlh9k12mmt85s79zuxr4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-18 07:19:18.812214-04
m1i3xxw6190t3d5ui5i4x5gfgkokwfxh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-18 21:47:23.268908-04
gsl7o7ggcec4zw4n0rhz5117mhqdj8is	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-19 08:12:10.466982-04
adr3qm0ehch5kddh4wfjnrc0fdi9mj8u	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-19 19:35:26.471171-04
4ejj1vqw634tb2qv92q39welx9qr6shz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-20 08:39:36.41744-04
ro7qr7kvu2yfh12isg1mpxqtx79mqsd6	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-20 23:42:25.626872-04
7rzxgzq2lngfg9sfdxwqylxv9szs5my6	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-20 23:42:25.780771-04
v7a0df8tcwi205w5w80xgu762fl8o0wo	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-21 04:57:48.133455-04
6cm6lbhcv4hnt4402mzsbueozdp4ndcw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-21 23:51:58.706512-04
6b8dwhi57l2q0bvhnbbs14yqqw1xr2pm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-21 23:51:58.838086-04
9o8nlah6xsmj27qfeo6shdtze06e846z	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-23 08:23:01.968039-04
3n7oblc8fb3c2sncnuulj1ty1ulmnttc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-23 08:25:05.701556-04
zi57sebwgwzvlnb86g3r18228570m23o	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-23 10:42:02.442576-04
shpqsyg52hxrpcr0l4bwmvfh0024y0fi	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-24 05:56:27.985375-04
x5chnhmynugbgu8kovy6teb88rwwtytr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-24 05:56:28.137476-04
ky6q9uh7sqcrk7g94l8dsvvxws1vnecs	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-24 08:50:05.272417-04
wndvwh1uiv93bk2lz2dwv6qg0x96mgjg	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-24 08:50:06.552901-04
gdl2geu4t2mx6s1qmo8gxceopavhspdq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-24 15:01:10.204567-04
c61p7xgc0tkqytwvqdx0wu0bnjkh0lqi	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-24 15:01:11.706527-04
iyjcnp8a9w700k0gu2ipj1xtmo326gui	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-24 19:16:42.473166-04
xcpo2bej793yw28naymtxuzmm3tuf6fq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-24 19:16:42.618832-04
pxjbds68rmoxat10ai8bvta4knaev1b5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-25 05:24:06.440647-04
y678z43h37witktfpo4rbmd6g2leyni5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-25 05:24:06.576037-04
wp8is1ygdca24hr1marm5uvsn1yisorz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-27 10:22:22.939309-04
67mnkt0e0yj9cjgm4yhkmdzpqsicbuw8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-27 10:23:25.320916-04
hwnawoes7m0dh19kivj0v9bxk5s5qni8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-27 12:26:31.761039-04
hgg9o0hl3wh5p47n5fi82gvu5mrz0zpn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-27 12:26:31.931659-04
05adiietfw7dmvga66n02150ci4op9at	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-27 16:44:30.800088-04
3ltwvd8q76aril8fthztretdlbdbpr15	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-28 19:37:16.130384-04
lde5pyhbjf5zgzy1aofhuoebd1kni9pc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-28 19:37:21.540114-04
8vkmvwxnmqy3z6e98csgvw06da12wfnq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-28 19:54:41.306086-04
vz2tjj5w7lpwipzgaekptncklom2o1rm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-30 17:09:34.719064-04
jm4874d6eiobany242h9ytrt8of6kd41	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-30 17:11:21.854933-04
u1l2sh4e9c2g2myjwg6q8hndhijtqn27	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 03:14:02.097461-04
oj2lyxrgjp3tjna0bkuwj2hedzomv9h7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 03:14:04.28182-04
dpw24i8qqkhjnevjf4zec7381agkb8tn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 03:47:30.766475-04
l95z7iegt4em5kmcuixdgyhpaixds5ld	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 06:59:51.67831-04
id2e1bkj4dnwrhiljpxspjjlvurw3cyl	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 07:49:30.058559-04
x8qere0xkhrtj1ar6y9le5xtgf7htgpb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 07:54:39.628112-04
w675w363cl5ghfxw1phmsmv52x8y6zvg	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 11:55:50.15225-04
msavv1nlnr42oo672g4yvfucrdwy9ku7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 14:28:55.343082-04
1pbjy03lwgr9h0shfgvoj3xknnn99pze	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 14:29:29.601944-04
p766vac0uh45amy72ly93eqjb7v9fuys	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 15:37:13.979109-04
6sc532k88ireg8yolyhtapnth8oucu4d	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 17:09:45.770065-04
cphi0ovozs4s8hlbb8dfg1wufbiutncv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 17:54:48.822822-04
hv5r59pvo8cjb40bfvu8t3pr9w8d5yux	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 21:10:53.959745-04
haunz3srt7scht4y70ck4koel9zmt04d	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 23:02:09.132889-04
7q740cwxeqzfpyrtr1n4m05s10emq4rb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-10-31 23:51:29.270629-04
u87lynpaov78gigsekj4r7gtq7cu8q35	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-03 16:27:11.797611-05
r52tq0hbpgz7b0xi8pnr45cephi4ou47	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-03 16:27:12.017576-05
wfiuit1mawnna1p34xhwtg8sc2pkekzj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-03 17:26:12.161497-05
i69flz0x7739o26jsek9wxkw5lzq68gr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-03 17:26:15.450674-05
6gahyp7bda7natzgau2atxdlr8ffq63v	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-11 16:07:43.264996-05
loxw336d85ep2sigp5rdqmcr9oq22a2j	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-13 02:24:28.641242-05
7zoot0rufzshrbl8rtse0tdfn380z7fn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-13 03:54:39.248075-05
o9wvhhaord36zpxyhl10nc1fis5kg6vw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-13 19:59:53.925838-05
t5emt0k4bflnva3mwv5bldrjsowot92g	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-14 23:48:28.450788-05
fe9ju9qf0vqgrnuac92k8dcr9oj7gydt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-15 05:38:27.117883-05
1nu8xon233z5jjmffzwxve5bxrl9vpiq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-16 06:45:28.856129-05
rug928wxovv5t3ceh68x4iu3i3rrehq7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-18 08:13:43.306773-05
r0yubeplky15xr1jxrl9y6r5kw7atwb9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-19 03:53:56.623324-05
op7m8jrbemgv4cvhnbi7ycl103t4gxn4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-19 03:53:58.522912-05
avtnn7g95d4a3yc49dc97a1bcoxvz5je	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-19 03:54:03.414101-05
qaqfyg0yslcut2qmbw6uquoo4u1u45z3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-19 09:22:43.104185-05
22iw3z9qc5sx66oz557yp5vs0n5jevkm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-19 20:11:14.366858-05
hehibjns763srs02a18alj3rjy5crwvm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-19 20:12:23.32155-05
okiab8kou9lrtvyzc12hlrig4ibtxfc9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-22 07:58:52.466949-05
3wkxu7ota52a3fnc16t7v1otfnborar8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-22 07:58:55.175704-05
n8c05ykmfahdeh53wiajf3ow352w9v2a	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-24 01:15:17.051191-05
nex5jpk8aatk1rm24mrhqit1gsudmkim	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-24 01:17:49.462124-05
8sl9a8w4qpmnldhb74wtgp1sp0vffur7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-24 05:34:35.498207-05
3gnmvrs54wdnd4rk0bmp6q2nnekbhgnb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-24 05:34:41.480229-05
bpfidaqls8n1vjryhka9dhg0rkym8xxb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-25 03:06:09.997252-05
xjvfdyal2x752h0xihpheo08n9uriucb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-26 15:58:55.972943-05
dghxctbcjvb732y71yg8c9jiy0eur96o	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-26 15:59:25.957957-05
10saap70mor3lj5szjs1f2qdme8hzdcp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-26 18:50:26.331767-05
rrn3ce0gbtn3ab6bqyvyslrmbm1ufu1r	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-27 04:47:05.349902-05
esnpn1bq6zd7pfp6kz2xua7hw7p6yf6s	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-27 04:47:05.824828-05
o74mm15b2ycpno7y03j1tu7mxyzc7zyj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-28 18:08:34.040061-05
yx9e68qibxkmxvjimnjuz0472grqatnu	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-28 18:09:59.200206-05
63lm3z7kl2czbxvcbr5kk50fr3yib6xz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-29 10:06:31.74003-05
z8xwz4mlrobkfbl7exdsprxst0yi75m1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-29 10:06:36.088873-05
mv1f6svbi0bcgq0h9mxr9sdq4qu9f0k0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-29 10:07:26.794868-05
clgsfpaci75ik7z3g39s6u7awysg90j8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-29 10:07:28.495012-05
09bup628safft7wc3pjvkscvnd3ms1rt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-30 12:11:01.923566-05
mne3yn3saoslocbkubofezeeouy708wu	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-11-30 12:11:04.053455-05
ijvpdd308vl13lcl8bcsjrco2179a29k	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-01 01:24:06.808067-05
63trbrz5dzj2u39spoez84b2lt5ly4yx	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-01 01:24:07.10729-05
sa0bv7hsdscgado76lukulr0dr50ywqy	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-02 02:04:27.331283-05
kyoc540tlqunsrbzwv1wmt76sxylm6dd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-02 02:04:30.043785-05
js9jssl8t3b3ymrspc4azk3gr38macj0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-02 02:51:54.988855-05
kcch6bjwh2dfa38d14be6oube7osgvlq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-02 02:51:55.664613-05
xoqmrsu0k8wa9c7rs8uiarwr0dq5zpmh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-02 23:19:24.476636-05
z17vpc4bl6i57gb289ftjm0hui9cuj77	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-02 23:21:00.963167-05
j5gktmmyr1nup489634zvq6v95rbp2n0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-03 15:06:17.785654-05
194wp6pfc45ws5tqfbu7b2b9owl677fc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-06 12:50:20.552849-05
lp10dmergm80tnlznhk7jzc39ipvm03h	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-06 14:38:23.003117-05
2qgr02kskme99g09ox0h5eg0k4mok1v5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-07 06:24:17.716962-05
0cas7k1qnimzs6fzlr8eqnmnmfp6q55d	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-07 06:24:21.555427-05
lsnasa095tbai488i1hjixs8z49f5fkx	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-08 07:21:44.749557-05
1nd6k9ts8o6wqv83khw1y37l70q6cmgl	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-08 07:21:45.162659-05
i1fzhqwcgxphfl57p6wyjy3oxkvr437z	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-10 00:00:12.64681-05
2vfnmiufevucygqiwd5bidoy6049eg2d	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-10 00:00:22.29613-05
n87c5nh3aq67mctq041w8bht6k6dk3hk	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-10 00:00:29.264596-05
edjy66osbek9eqx1aw1ub6gf8o3rkvda	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-10 12:25:24.952321-05
zcw2fjp497hshh0bblisg5iv7oyk6al5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-10 12:25:58.944831-05
eciu38hip4i2pzirb0k2xy8364d1os7n	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-10 13:57:28.472148-05
16wg9g66uf3l6ddup4f9n9ulsron86iq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-12 04:47:34.600491-05
ieyn2f0q1iy07khx9xcda30kem2641dd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-12 04:47:36.960372-05
ill4nho83888scxnvm7f9kl76636tubr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-14 01:21:58.810834-05
pmm8ibv7okqfp0oz3ebtwh22kl283f3k	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-14 18:45:38.738112-05
eolam7m4q7jt2s3raq7due7dxf02x4sw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-14 18:48:37.365527-05
91pyneo8rbee7umq3ozsu4dn5h3e7hzn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-15 06:46:19.800252-05
d8qohkd5ewrxyxrels0lkuic5bzjutrl	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-15 06:46:19.991491-05
11ncwymbdc56wtuwlncfaee1aji9f7ve	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-16 12:51:29.285205-05
mh045a4yk14s4e8ahsurps650qglr5p4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-16 12:51:31.575342-05
hwd47chfmglsta54mrgjwjkzp8abokbh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-18 04:18:39.583953-05
hasn6zeg76uwn2nf0hu51iippak5nq6e	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-18 07:53:13.39921-05
jyxc3tslet6jodgepsh13awqy9vwlwbk	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-18 20:10:54.243374-05
31ubaxfguq36bad7lgnrxnk16alg9qeq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-19 03:39:43.436788-05
nxbu7v1dr5zcjhtxo59of732mgoj82hn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-19 03:39:43.692785-05
f2nkwxoaqtahyb5i46pczoh0jmngkui7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-21 02:06:01.298666-05
1hszujjud3558x05hytv2s5g896eojy4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-21 02:06:03.542191-05
3bzxijz1bcm879frnhgdc9k3x67lubuu	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-21 02:06:21.053746-05
lkwrgvknmp89nm0uiggdk8kum6vkealr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-21 02:32:09.12635-05
o072ojfizw6gjvilys4z7truyasr4w9h	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-21 02:32:12.153495-05
qwt0hcy4c4qnn5y5htm0vgls7a2scu79	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-21 22:17:15.717594-05
wni8nu9ir0h5148mzp8535zbrrhefrqs	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-22 07:14:22.077837-05
ki43mm0o53w5e0zbv8ual64nzbucdbn1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-22 07:14:22.206969-05
v7g9c7xq8e8lq4j8t6gdfb00569esnw8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-22 13:45:31.16877-05
ss3yzwmq7upf3n0hvjo524vuc9h18xqy	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-22 13:45:59.514503-05
nbvrojhcgwayxa9l2ozglcho932ol1l3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-24 01:41:02.666038-05
5i1dzyt0n5zdvkdouj3jpqxq0isou49n	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-26 06:47:41.477658-05
j9dwxw62exf1rzfus6vd2mj9ctkudpho	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-26 06:47:49.402638-05
qken5gtudwx4b5i4l4fi3c7bfkzyj5tx	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-27 02:21:37.842481-05
lnc5um3clt5ml1vfie98y4qtd3tfsqnd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-27 02:49:38.080268-05
8qdbclg81zvij7zpch77ibnv9gc0f8e0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-29 08:15:58.689731-05
1b54lex2bgyxszd0a8nauxgst5d89wwd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-29 08:15:58.839338-05
1r7klmwujmmu42t2vxzrwm05lki7q2sq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-29 16:54:15.334492-05
94amz4tymaeenk12kj23nco6u25uj4c6	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-29 16:54:15.558581-05
lr1hkre630d88bxr0e7m8fpal0be24tr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-30 10:08:12.240969-05
mryy6o9itvt3s0qp30rtd2u0voli6kr0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-30 10:08:19.641347-05
h59aocqv6gcffkjs0x9xsricn1t75iew	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-31 02:14:05.482062-05
wyin5snobuek8zdx7x2ixwvcdmd7rpuc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-31 02:14:07.681586-05
uo7fbfwtt5ec0biwvlo646sh6fto5mrp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-31 10:06:03.519987-05
9ia3m9jl5h5p1fqgbwvm1fo9evgzv01m	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-31 16:15:12.720355-05
990rsfet3kfvucqy0uoqejya60bzbjln	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2014-12-31 16:15:24.770703-05
har80j383pzt593nip9z17ac9eovq5ix	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-03 23:26:37.679956-05
axbi15ff24a2x0w2u51k8mn5xmzh0wop	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-03 23:29:32.920069-05
am8hj8p8xae039618kz4xr5ptdhrp1rj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-03 23:55:24.840664-05
xqb0rmevw70cyl736n1f2x6zrysk440p	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-03 23:55:27.512118-05
wnpu75m2qqify0g26rfinw0est93j5ti	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-08 00:03:26.337098-05
bb4fe433udxf3oewpv218r0pamxz2e3a	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-08 11:04:53.861246-05
l46xes3w7j7502tzdzwta0eceh23s3u2	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-08 11:05:09.046777-05
rsg6zvtmymzj2c3wdw81owzpj4c8um6r	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-08 19:08:43.971185-05
0zguc95jpw909rxxwe68jne7fszke4qe	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-09 09:10:30.215333-05
44ceqrlip76rhyvzpgxc4gl7kubim0g9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-11 11:27:21.143171-05
mgaovzcuri8xe3cx424vmmu9cztbu80n	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-11 11:27:24.184844-05
tpiv0ez76a45upcqq7dq7qcwvbnx0mrp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-11 11:27:29.694083-05
sz22melzg9aimwniwwpt1qut2ljsabif	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-12 04:17:44.835035-05
xyjlkzd3eoi1738d2dwdir2xrj9t8fdp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-12 14:07:15.932506-05
stliy8rwymkzdcdaoqlckr7oj4fa40yt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-12 14:07:18.458603-05
ef6hjbgt97z340tv6jyjheuyh918dncw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-14 17:47:01.378124-05
ypxm68tz9l6wbvum3aj4mnphcgted716	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-14 17:49:22.907029-05
gtxilbcdfi1i0ryo6bsghpciu54bmp9t	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-15 10:16:12.21907-05
rcgz59myymbaxb9kadvmgmrkgpvj9sch	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-15 10:16:15.560268-05
dnaef1ycqu1r7wammpxmf1y36nlhan8c	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-15 10:27:05.547125-05
ghjdxzlk9ez2u7c7c9brnouf6swko653	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-16 01:09:19.118736-05
jjrdj0fdyn44mjnsti3ocl5ownjj736m	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-17 02:48:32.949135-05
g846alxl0j51qboedv71iafwcaypkd6e	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-17 02:48:35.282194-05
w4e8mfag06dqiqeryqoh98u0pgo6fhs7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-17 09:17:06.451833-05
p37re0xnli9f92p4llo776o858t24762	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-17 20:56:51.83773-05
8tg18y4czlo142bjcvmdustyrq8m3o2r	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-17 20:56:58.87014-05
5snnwenkfduws4yf3305n36idmkpdhoi	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-17 20:57:28.896438-05
y0o8q0j6knx3y5ahqsxf5sq88aptmbob	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-18 07:33:11.960843-05
d5bco6x36z4nj11kypb9uonj2upyx6ro	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-18 23:33:10.600153-05
ozwzg5b9lz66da7xjbpv2ie5ie232dz1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-20 04:10:42.880477-05
e5flb4i5ehqmxsj1ixo6woi0wurrl4rj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-20 04:10:43.575133-05
632hzjk5ya55g4r2egn9ritho41eylth	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-20 13:53:15.192376-05
9vb8j6yvvn4wve3rrn2f78ycj67pkf3u	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-21 03:48:39.065408-05
q2e8378ov90ckqat816wxalnom8meuma	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-21 03:48:42.641671-05
vte2m08gpf8f71nr4oqi9e9s8wj3u2j6	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-21 03:48:47.743013-05
v28cq8j5pqbyihszdlgg7qo0rel4ba3r	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-22 04:18:03.53749-05
hh2vl73azhi60kwj78cn1dy1tubqkxz3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-22 08:39:42.240271-05
ei56rzhy5whqau2oqk4ejza91ei40c76	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-22 08:39:45.016937-05
89qbta4rgvqx0upuxxd3wh4d2s591z5v	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-23 00:04:31.94551-05
ci9919bc94jnjc4zqp55syhs26iyx76b	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-23 04:35:06.726398-05
1tjbq0bny3darfybw83w6h0ri78mjlna	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-23 05:56:37.281853-05
k2jd120icz6sva9m7g2wqvv1ehy8gh47	MmM4NDU4MTIyYTYzMjFhNTdjMDhkOGZjNWM3MjI2YTJlOTU3OGU3Yjp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-01-23 10:06:06.577787-05
eau4qyrehwakes2ypirqpckc2manqtpt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-23 10:19:36.869458-05
k3e3nm7fnovmujrt3nqj51wpl393745h	MWNkYTg4MDEwMjA5NjVhZDY1MTAzZWZlZjZkNDk4ZjNkZjM5MTAwYzp7Il9hdXRoX3VzZXJfaWQiOjQsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-01-23 10:20:09.417555-05
ckr8u3df7n559clq2kfbfcgv02zmq5lv	MzAzYWFkOGZjYTk5MTk5OWQ4MzgwYzJlMmIzM2M2MjMyN2JmMTk4Nzp7Il9hdXRoX3VzZXJfaWQiOjUsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-01-23 15:00:59.231401-05
td3jlsr529xxv67rypzqudnzf9pfmkdr	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-24 02:37:28.341998-05
thfjg2zcs19m0ok7vi3m25trc6gdyagp	ZTE0ZjY1ODY5N2M5OWExMDhhZjQ4MGM4NjVjNzc2NTE4MmQyZWE5Mjp7Il9hdXRoX3VzZXJfaWQiOjcsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-01-26 19:57:46.00697-05
g3k77kft6nu6bhfzcovhkao8n0mdkbku	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-26 23:54:22.337554-05
2chrlw8ikf1wk8502jhyd44oezzrb3tv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-26 23:57:30.742067-05
q0ywqxj418qrs6w89awvbgeo89g6p3i4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-27 16:02:09.306654-05
i2lxdays1bzgpyzprve1ztau28hffoio	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-27 16:02:11.644988-05
jkx5217xnr6p9qtfsi6z5uec2am2n3b3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-27 16:05:38.595102-05
l1n61agua7u7w56gelfwxyzrk2t6s8w6	ZTA4ODJmMGVjODk2Mzc5ZTkyNWYzODY4MGYxZGM3NzI4MTJjMzNhMTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjV9	2015-01-28 22:06:26.390267-05
b9b4wdl0xxx39d8eymt7kc2utdmpl9lq	ZDZmNjk3NzFhY2NhNzgxNmI4Mjc4MzNlNDljYjAzMTQ3NTRjNjRlMTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjF9	2015-01-29 10:14:39.361603-05
luofy4fsf79dpqqnhm9w38gwx41yl57i	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-29 11:00:38.831158-05
43l6257ftfemfbdy97yyw5eocl235yd5	MDllZjE3ZTQyNjhhYzE3OGE1ZTkwM2M3Mzk1YzYwMDNkNTc5MGZiOTp7Il9tZXNzYWdlcyI6IltbXCJfX2pzb25fbWVzc2FnZVwiLDAsMjAsXCJUaGUgdXNlciBcXFwiZ2FyeWhcXFwiIHdhcyBhZGRlZCBzdWNjZXNzZnVsbHkuIFlvdSBtYXkgZWRpdCBpdCBhZ2FpbiBiZWxvdy5cIl0sW1wiX19qc29uX21lc3NhZ2VcIiwwLDIwLFwiVGhlIHVzZXIgXFxcImdhcnloXFxcIiB3YXMgY2hhbmdlZCBzdWNjZXNzZnVsbHkuXCJdLFtcIl9fanNvbl9tZXNzYWdlXCIsMCwyMCxcIlRoZSBlbXBsb3llZSBcXFwiUm9iZXJ0IFdpbGtpbnNcXFwiIHdhcyBjaGFuZ2VkIHN1Y2Nlc3NmdWxseS5cIl1dIiwiX2F1dGhfdXNlcl9iYWNrZW5kIjoidGFsZW50ZGFzaGJvYXJkLmJhY2tlbmQuRW1haWxPclVzZXJuYW1lTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9pZCI6MX0=	2015-01-29 14:00:02.87333-05
yixfd8r8kjz2sqtmqj0ih9umsuyf13go	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-30 11:00:50.770766-05
n8ie2fojtynj7vf0781y6dm9u5r9mbyz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-30 11:00:52.937842-05
dyc26ooj3uc5dxijt0lkwdg5vc6bab5k	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-30 19:28:50.048055-05
zbkg3mvdv2sqd0uc9801k7l3va1ityzj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-30 19:28:50.322063-05
1t1slszsi0acaa1hylo782uj3i0vf6k7	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-30 20:36:31.007712-05
59e8fcahjjfgwoartvjkldctb5c642yb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-30 20:36:31.227857-05
f6ykfr4ymkfumz6gxsuhhfbtrtllv3je	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-31 04:26:41.441995-05
20k6cw4j0pav46dnw1brzel821mfvg60	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-31 05:55:56.828361-05
bmm7qn4i3twmhb3wcfd4yu4s2dez2irb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-01-31 19:31:10.287264-05
tbjrjdiersc82rthx2aaf4u75qpbiawa	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-01 13:44:16.391776-05
fin0hcpcxa1x14ez5rrkielvvx7lf8wy	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-01 13:44:28.329461-05
f3owhyvoa93cok7b0amtgtqu7o2xoj2n	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-02 04:19:43.180131-05
g2kag0y0rseu30yl9u72miod7tfuhzhv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-03 22:15:15.630918-05
1qck824xf9ygm07xkh7mckh813y53fwd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-03 22:15:55.887617-05
lbuuugoq27p6yd3xmj79r6p4m1u3toz9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-04 16:28:31.394281-05
nvqwtxk1saugqpd2jab0wz7xexzvwmc5	ZDZmNjk3NzFhY2NhNzgxNmI4Mjc4MzNlNDljYjAzMTQ3NTRjNjRlMTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjF9	2015-02-06 14:33:56.809968-05
cs2rlo06261vhaxwg87efutiih2mnpaa	NTlhMWJhNDEyNzNmMDMyZmZiOGI1OTE1MjBlNjhjMDZjYTIzODhjZDp7Il9hdXRoX3VzZXJfaWQiOjMsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-02-06 17:34:03.77526-05
7cvaqwe30vevldvnkzx6sswlaqt2iava	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-06 18:49:51.333935-05
2rvp2sat5f4tm51pe0bvfeuetuzs1pmn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-06 18:49:54.379145-05
rz281iivibaobf7e5tsafovmha89lf8o	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-06 23:53:58.524077-05
tgt5b6gw3lrcvuyj4hwicx6e4995n9fe	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 04:42:03.620604-05
vgc92ymv3zzckbbzql17dyw2pn456kxd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 04:42:14.029994-05
4qmtbc6vvamm0lrvw7devy5bxatte7k6	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 05:26:50.553926-05
gv1fj5tpr01dloxlrd2u0cd635sflm9m	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 05:26:56.126848-05
n5mljk5la7i6zub4gbhgenb9jgmfb50z	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 05:27:01.12252-05
bt1er176eub8wwct2yf815b5g9hph7l4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 05:27:02.917615-05
igmr7n7g3bljlczvhaux2ne349gwk3gb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 08:39:27.666077-05
vczwlul111hcy29bs10rpxaea3qw4kje	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-02-07 08:54:01.890452-05
1bke2wokukmmrp5zgkd3ahttntd0uzbr	YTAwMmU1MTE5MmZkZTJhZDZkNDUxYzdiYWJmMmQxNmVmNGYyMjdjMTp7InRlc3Rjb29raWUiOiJ3b3JrZWQiLCJfYXV0aF91c2VyX2lkIjoxLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQifQ==	2015-02-07 08:54:26.227115-05
n9le43xgv45tcq3qjuqfs0pwqtvftmdk	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 10:18:02.353896-05
hvhtz4j95uqu3v7m2bi8dx1eix20b447	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-07 14:07:27.129451-05
cib62o3yqvay66z8le2i54tdlt1rem4l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-09 09:46:08.596634-05
8dwi0gxyop72cvwf748099y354c7a5am	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-09 09:48:13.821666-05
nmkx5y1u23m8hdqmwlsy7555tq4m1q98	ZWVhNzlkMzM2M2JkNGZlZDcyZmUwMTg2ODA4ZWU5M2Q4MTQzYzRkNDp7Il9hdXRoX3VzZXJfaWQiOjIsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-02-09 12:45:58.973086-05
id0qc8b4xfa9mmmmi5cwixt31t3xtet6	MzAzYWFkOGZjYTk5MTk5OWQ4MzgwYzJlMmIzM2M2MjMyN2JmMTk4Nzp7Il9hdXRoX3VzZXJfaWQiOjUsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-02-09 13:56:12.992392-05
dro8ozegzkvkbv92mpyhbj7br5mdviep	MzAzYWFkOGZjYTk5MTk5OWQ4MzgwYzJlMmIzM2M2MjMyN2JmMTk4Nzp7Il9hdXRoX3VzZXJfaWQiOjUsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-02-09 14:00:53.659761-05
q4xlei8rzakb7kkarpsrri5y7gghpwf5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-10 02:24:26.599979-05
h5tvtjer88k9y3w2l7jfz5s0lqcz7fcl	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-10 02:24:27.012776-05
qllt8kwrzdjdhorbm6dz28d4kkf8pafh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-10 02:51:01.005832-05
2w5zv1zixa9y65svzaqn60djd5aw8cid	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-10 13:03:00.219065-05
pe58o5wb1g6foixaxyayhtmuihitq511	ODZkODMxYjBjNjZiYjIzYmM4MzcwMTEwNjc5ODg1NzFiNTcwOGRkMzp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjd9	2015-02-10 13:12:52.281384-05
6sewo5hw5hof1jyoh2lxlidlfoky82mt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-10 16:49:35.200108-05
cf480lk3qqowjkumvunj3adr0zobl2lc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-11 03:32:49.198069-05
92dtfkyi52yqgi0pmnb0mox02rewqtux	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2015-02-11 11:15:35.778987-05
3fw8ebjcoo998bib1fpxmafc0wa5js3w	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-11 11:35:16.617734-05
0lm0phkmus6xekqscvp0vkybghodjpn0	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-11 11:35:17.586831-05
axrthzixyl8pixvxo8drafcraf5figxt	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2015-02-11 13:06:05.772784-05
05xd1gf0evk994c5jnp2kgwi48iizq98	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-11 17:24:47.58124-05
2q3wpssrla1udmtea18qp6m1k9arjaxs	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-11 17:34:22.311041-05
pya092ykie39tq7ugakx12ixmyrqz74a	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-12 07:11:31.613373-05
xfewxn5kgp15nq4fx72x9uh5bs482bgc	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-12 11:35:44.286322-05
kdjtfm6f0fa83bct0iuuym5yaayunbd4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-12 14:16:45.923117-05
upja0grre45s3quakjqfgtwfe4p0prhb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-12 17:53:26.051403-05
h14uthr9zbh7j54rg7yk41h6eh16dlie	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-13 09:32:43.832853-05
kh63ym8y9tyjqqp8nqlu88l7swf0aohz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-13 09:34:09.345009-05
daxmsoos4sa3et2vcmfyoapgn216uiro	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-14 08:40:38.380007-05
mu9uvdbut701dmw0tx3qd8075oan4zmz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-14 08:40:40.791887-05
l2qphu4earvtfpossp28v3sonlset9kf	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-14 13:23:23.132728-05
au4h6w872wgbpga3tg6ia5p1ixntwdg9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-15 04:32:26.15267-05
iikqbc03ooecvy2gnwvwaw40yqfzml96	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-15 04:32:26.385371-05
pulc8pv7gddjp5ut9zriyqcjru74zop3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-15 14:45:14.562853-05
tt1mq8hhxodt844e7ixdf28e4mbqcjc1	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-15 14:46:32.608723-05
mkfvvttsg38gef6t1au44j7cs9ng65sw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-16 11:07:36.053564-05
735hzczg72nmaa0xbznxnp2y4pmrbrpl	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-16 12:54:26.472454-05
ucvfsikxjby46d24spcqf6iorgh2szof	ZDZmNjk3NzFhY2NhNzgxNmI4Mjc4MzNlNDljYjAzMTQ3NTRjNjRlMTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjF9	2015-02-16 15:05:17.237875-05
aw1v41xus4nguqnr3ljba55g85rmw59k	MTA3ODM5NTc0MDU5Y2YwZDBiNjEwMmUxNTNlYzNjZTQ3MDFhNzVlNjp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjl9	2015-02-16 15:15:19.288919-05
224pfhn69dfv3pzk4wfdpadxwdk7hv87	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-16 15:39:37.046845-05
xvyb9acn9z54tru6r3f6gd7z11dlzk45	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-16 18:57:29.717799-05
wbpkcx9vtgvwf3pylf73pc80wrt3ca2b	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-17 04:35:45.873054-05
t2vn6o5t4x1kuvj1o10bzdxeditnxqga	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-17 04:35:53.549555-05
ip9hj3dwhwy4l8i8ru2293l7eib3wg34	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-17 10:38:01.945665-05
b4aesvn8oxp449580abqmyaoh77gvsq3	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-17 10:38:02.121171-05
p559g2lpea1k32mha4rvik59yrhzj0qd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-17 10:38:02.281159-05
82p36hd30dl2r0psjh4loxur2qw21u3s	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-17 10:38:02.489304-05
qdihk5u7f6ioov24d6rskg692jatpe4s	YmU0YjgxNzFjNmUyZWViOGYwNWFhNmY5YzlmNmZlYTZhMmRmNTM1YTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjJ9	2015-02-17 10:38:07.070556-05
bw0e938zysbmv6eufyz5h90jw3smw8ny	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-18 04:47:34.330161-05
qvljgkst1frb2eqlbaqfh8pfi43uc6ag	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-18 04:53:40.243224-05
f6lxnrrlaubkum9xpre92whx43rf4ut5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-18 04:53:41.843749-05
0m9mnc8g5jjdhx2247kj23jrmxmsskyo	MmM4NDU4MTIyYTYzMjFhNTdjMDhkOGZjNWM3MjI2YTJlOTU3OGU3Yjp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-02-18 14:36:19.521875-05
5wpbjr2kt3mfhut4lvhwa20xe087r4f6	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-18 15:16:26.564353-05
tf00w5rsh9esfilimcbshudu2pno27rn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-19 08:39:01.549599-05
npr2vcs8zq2ko3p9ah5lnwct6qhkxkzp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-19 08:39:04.422308-05
nbccu4i4upqmgwl1iyvqgbh2ldc9heaq	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-19 11:17:30.650146-05
5zisah7zppgsela8b8vlyezj80ac4jvv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-19 16:16:45.63723-05
3zrcmpaq1hyxe87yqna0mik90ri0vhsw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-19 20:30:40.996972-05
sc5e77srtdwg11egbmb9rwe8j5255cwo	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-19 22:21:46.051724-05
3pg25ky1oe06g6yjyfdpmxqvshfdg3s8	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-19 22:21:48.327821-05
q4vl5bk2j4cx3tepe65olpt4bpxswl0p	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-20 10:34:56.488198-05
lgnlh5vf92zfmgdfmu51y6o9vdv1dwyu	MmM4NDU4MTIyYTYzMjFhNTdjMDhkOGZjNWM3MjI2YTJlOTU3OGU3Yjp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCJ9	2015-02-20 11:33:48.793845-05
esrfnfnz3p9v09bhdjdgoog6u9a5yvbe	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-20 14:40:33.645941-05
svuct1cqodzee9tmoqorwjkao8zcs387	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-20 19:23:07.358267-05
d2gr8lmtwa4fezn697w63rxcjz8rgiqd	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-20 19:23:47.14911-05
ezpye7jsie27eswh488ypuxdss561max	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-21 03:23:35.55034-05
zyr224vyh3nmtkyx2wzifpzks4vea4sh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-21 13:00:52.219006-05
e7dp7gudet46x6aki32gho4v1wg2veuw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-21 15:28:41.643281-05
de9sdstjvocku1puabkykw980cy6hi71	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-21 15:28:41.9153-05
lcsqo07ahym5m0lxk0lwhe02wufg3bgp	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-21 15:28:42.130405-05
64o3xftva1kf4ke6a7b2bqaw7cc2ehd4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-22 16:11:59.477958-05
0r7asz02ra4alfcgkiq0ptdipx92azxf	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-22 16:18:18.446714-05
567kgzihg0gowcf6lt86gjrc9xheigz9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-23 01:17:38.635919-05
7m6ucit7czrp9s9u22apgqh39ijbxvtb	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-23 01:17:40.875359-05
0kivtpldzfu10cspymog9i32wdld5oe9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-23 10:52:16.014965-05
w8dhi8dx2funki0m7zykg0ovxp5soodo	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-23 17:30:10.721955-05
d0yaaocdh8r4ypowk02yim5tmb7svcdv	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-24 10:45:45.542776-05
4fjm0syrgddt17q8fiwfdwevgm571xf4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-24 14:48:40.826871-05
nyve8hbc4a0id2b1we86uyapuu3d8lw5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-24 21:08:05.287741-05
ob1nnq4r9torztr1s3t4x6yj4m0wt98p	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-25 11:26:11.883512-05
7w93msn2s06dvh4l2kixzd60v0u8wnw9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-26 07:06:56.130888-05
3zewociac4ke04o1pwne4v83zj7i8w4i	ZDZmNjk3NzFhY2NhNzgxNmI4Mjc4MzNlNDljYjAzMTQ3NTRjNjRlMTp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjF9	2015-02-26 08:36:17.042659-05
ogwvohra9xt6e2zpj5ng3vpjwfw2teia	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-26 09:20:19.69988-05
o25pnsptkg9r799nz4kd8dfhwnadg080	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-26 11:28:37.888794-05
1o55oy38trx97svjzusibkw99tz8cxcj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-27 11:51:40.320999-05
7yj57a2q9ltg1sf296qvihzb0r13id0l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-28 04:19:52.654192-05
tq2wuxt0kvpsb7om6u5pqj0uhea2phqt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-28 08:19:57.588918-05
i3ra5kayk1k1yqxilwg2ab2ows72q3ok	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-28 08:20:00.965725-05
uu0ajaqbk98t9kajuviofqo6vbl4pmax	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-28 14:01:52.667918-05
o2av92wujtl5l9dmxm7ye2qnxvj8e4ao	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-28 14:12:38.557977-05
wjn1ucql2ok9v57heg6mej80x41bz679	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-02-28 17:57:53.120961-05
b3zvbq4xmcyxhg1trlb03nwk6qb31vqj	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-01 06:01:33.239925-05
eqg4czjbi02ctaek8fo92ob7ndjs5v4o	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-01 09:05:22.080984-05
fk1nqkx68hmcxysmw5yyt2nagk3kjj9l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-01 19:44:51.266218-05
111b6f3r8eq6cx2cgywi6e738xmtey5l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-03 01:06:52.437319-05
h3zx73elgrvxmb9arsti0emythgc9bbh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-03 01:06:54.649564-05
tp2ob5u4l4jcb8yk5ru53dmc0ejtxqbn	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-03 04:04:26.702618-05
fpgxhx308ucpz5xumbnib2xlwaz7t5zh	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-03 04:04:27.389352-05
cvchw9l66aw99ev3pxoxwr99bknd4mt4	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-03 13:48:21.535649-05
z7zzwed50qwr22hw506dhdahytx8sl2z	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-04 02:04:58.213707-05
kbc9qjsnb2finkmb74gsbkbddw0sfl8l	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-04 02:04:58.506509-05
avoy3fb3k6lh3rkwyypl9ywh6kjxawgy	ZDM3Zjg2MGVmZDVlZjQ5ODY0NzAwMGVhZWE0YTE1YmY4N2Q1YzMxNjp7Il9hdXRoX3VzZXJfaWQiOjksIl9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsInRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-04 09:03:08.430004-05
8fx5i2kl0lv1pc6j92dp40ad6tjtdsyt	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-04 10:13:43.746368-05
vy9c2jjrbqkkubh4cv9kc011oky1ava9	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-04 18:42:18.958039-05
uwwrlo7h2r79wq7bhit0lvzn3xi3p7or	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-04 18:45:24.399258-05
gf5ojk35yf1w80o0omu137lquhgk6hzi	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-05 12:15:29.889416-05
8ua3htj2z41jsi39d9tikdwv9ovgbjj5	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-06 08:51:31.21461-05
m2reepvbd4cykw6nvs4e13sor30i7m06	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-06 08:51:33.46358-05
2plqgs7h00f407c6dh665dr7x25vxpni	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-06 09:53:44.357979-05
9amn464ngwy5a1z7kuqci1vjnqph04bm	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-06 13:46:08.32829-05
im00ywcls2lj69bdnm54qfnjuuosbc5y	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-06 22:32:17.400266-05
29rwl5vjn6autffyjb5ivxlbl0szlpht	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-07 12:26:46.130367-05
zgz8o3o32a12n1ruvnvfa1cawndb1yqw	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-07 15:16:32.446032-05
gw4jfccvy36iywsttgujd95bqbfhrsyz	NGYxNDYyMGYzZDNkZWUwMWRmMjNiYjMxYzcwOTVkZjk5MDZhN2I1Zjp7InRlc3Rjb29raWUiOiJ3b3JrZWQifQ==	2015-03-07 22:58:06.357264-05
cqb2k2fwyl6lzg0nfmor8nylzvbar94h	YWY1NWYyNTE1N2IxYjBmYjA2ZjVlMjU4ZDZiZmIwNzBlYjk0YjA5OTp7Il9hdXRoX3VzZXJfaGFzaCI6IjU3M2U4OTJiNTc4NzFkMzQ4Zjc0NmQ2YTRiNGY5YTIwOGIxNDc1YmMiLCJfYXV0aF91c2VyX2lkIjoxLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQifQ==	2015-03-08 17:13:02.501672-04
yk3dcfj6nywghqct9ltuia7kj28dw29v	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-03-09 14:33:51.134754-04
u2hmulae8zw5h0c3ntgjeqgd0jnelapn	MjBmMjhmZTJjODg2OWE1ZWVlODQ0MjFiYmRjMjM4Y2JhOGU0ZjU0MTp7Il9hdXRoX3VzZXJfaGFzaCI6IjU3M2U4OTJiNTc4NzFkMzQ4Zjc0NmQ2YTRiNGY5YTIwOGIxNDc1YmMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2lkIjoxfQ==	2015-03-11 14:32:27.232226-04
j1d7o6q9aljxmh4thx0llwvxoyhjnv79	MWZlZGE4ZTFmMTliZDJiYjU0NTE5M2M5MDY3YzNiMDJjZjBkZjYyODp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaGFzaCI6IjU3M2U4OTJiNTc4NzFkMzQ4Zjc0NmQ2YTRiNGY5YTIwOGIxNDc1YmMiLCJfYXV0aF91c2VyX2lkIjoxfQ==	2015-03-13 13:58:59.726958-04
7a8u3s0isfhvvsn3h2rjkn0fy8k3rcvu	N2JmYWVlYWEwM2I0ZmRhZGUwY2Q2MWQ4ZDFhMjhmNmUzMmRkOTNhOTp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfaGFzaCI6IjU3M2U4OTJiNTc4NzFkMzQ4Zjc0NmQ2YTRiNGY5YTIwOGIxNDc1YmMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQifQ==	2015-03-13 15:35:29.078547-04
o1f5o1j1laogpokgwmft0n2suftf2s0u	NjAyNTFjYzY1OGU2NWIyNTQ1MjgyOGQ1NTI1YjdiNzZiNjQ2MDA0Njp7Il9hdXRoX3VzZXJfYmFja2VuZCI6InRhbGVudGRhc2hib2FyZC5iYWNrZW5kLkVtYWlsT3JVc2VybmFtZU1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfaGFzaCI6IjU3M2U4OTJiNTc4NzFkMzQ4Zjc0NmQ2YTRiNGY5YTIwOGIxNDc1YmMifQ==	2015-03-13 22:30:08.557742-04
1sadu1bh8ey1avf43ixfx6w7da3y72in	MjBmMjhmZTJjODg2OWE1ZWVlODQ0MjFiYmRjMjM4Y2JhOGU0ZjU0MTp7Il9hdXRoX3VzZXJfaGFzaCI6IjU3M2U4OTJiNTc4NzFkMzQ4Zjc0NmQ2YTRiNGY5YTIwOGIxNDc1YmMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2lkIjoxfQ==	2015-03-24 11:31:34.232621-04
etkple2klu2gajs4jd9i4gjicuxq3fd2	NzViOTIxMThhZGJkMjY3ODhmYzRkNzk3ODNhMjk2YjQwMzBkN2E3MDp7Il9hdXRoX3VzZXJfaGFzaCI6ImE4ZjFjMjIyNzQ1MzJhOTEyNDQ2ZTcxMTZkZGI4ZTYzMjc2ZTk3OTIiLCJfYXV0aF91c2VyX2lkIjo3LCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQifQ==	2015-03-24 11:48:05.043686-04
cytpop7gckjdxxhqas1ebwzjsgm1iga7	YjExN2RiZTVjYmFhNzUzZTBlODUyMTM4MTY4MTc1NmFiMmViZjFhNjp7Il9hdXRoX3VzZXJfaGFzaCI6IjZlNmY0MzExYmM1ODFiMWM5ZjIxOThjYzAyZTNjMjI0ZTU4NWJkN2YiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2lkIjoyfQ==	2015-04-06 14:30:06.878859-04
mvwi1v8biqxevnn6tuijavgozvmpbyr2	N2JmYWVlYWEwM2I0ZmRhZGUwY2Q2MWQ4ZDFhMjhmNmUzMmRkOTNhOTp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfaGFzaCI6IjU3M2U4OTJiNTc4NzFkMzQ4Zjc0NmQ2YTRiNGY5YTIwOGIxNDc1YmMiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQifQ==	2015-04-15 20:36:19.602318-04
5n2retjqqcqndo5dqz8c27ipmsxb4reh	N2M5N2QyOTBhODFiZjJkNzM0NGI3NmQxNjZiZWI3ZGEwZWJjM2EyMDp7Il9hdXRoX3VzZXJfaGFzaCI6ImE4ZjFjMjIyNzQ1MzJhOTEyNDQ2ZTcxMTZkZGI4ZTYzMjc2ZTk3OTIiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJ0YWxlbnRkYXNoYm9hcmQuYmFja2VuZC5FbWFpbE9yVXNlcm5hbWVNb2RlbEJhY2tlbmQiLCJfYXV0aF91c2VyX2lkIjo3fQ==	2015-05-07 13:29:03.918594-04
\.


--
-- Data for Name: django_site; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY django_site (id, domain, name) FROM stdin;
1	test-talent-dashboard.herokuapp.com	Test Company
\.


--
-- Name: django_site_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('django_site_id_seq', 1, true);


--
-- Data for Name: engagement_happiness; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY engagement_happiness (id, assessed_by_id, assessed_date, employee_id, assessment, comment_id) FROM stdin;
1	1360	2014-03-03	1362	4	\N
2	1498	2014-03-03	1396	3	\N
3	1360	2014-03-03	1417	5	\N
4	1360	2014-03-25	1396	5	\N
5	1360	2014-04-03	1306	4	\N
8	1540	2015-01-12	1498	4	\N
7	1360	2014-04-25	1356	3	\N
9	1498	2015-01-23	1356	4	\N
10	1498	2015-02-02	1430	5	\N
11	1498	2015-02-13	1360	3	\N
12	1498	2015-02-13	1300	2	\N
13	1498	2015-02-13	1358	1	\N
14	1498	2015-02-13	1506	4	\N
15	1498	2015-03-16	1356	3	36
16	1498	2015-03-16	1498	4	37
17	1400	2015-03-23	1400	3	38
\.


--
-- Name: engagement_happiness_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('engagement_happiness_id_seq', 17, true);


--
-- Data for Name: engagement_surveyurl; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY engagement_surveyurl (id, url, active, sent_date, sent_to_id, completed, sent_from_id) FROM stdin;
1	http://test-talent-dashboard.herokuapp.com/#/engagement-survey/1498:NIpDJJpgN8wtZ8CNf4WDWmspCrE/1:IqUc9ANLU821ndaGGRUtOpfhl5U	f	2015-03-16	1498	t	1498
2	http://test-talent-dashboard.herokuapp.com/#/engagement-survey/1400:eHZWmUpOOAJXFxaA3HmzTMHNEaA/2:DS6UgznFuJvlbWwUXQKPA-SWkCQ	f	2015-03-23	1400	t	1498
\.


--
-- Name: engagement_surveyurl_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('engagement_surveyurl_id_seq', 2, true);


--
-- Data for Name: feedback_feedbackrequest; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY feedback_feedbackrequest (id, request_date, expiration_date, message, is_complete, requester_id, reviewer_id, was_declined) FROM stdin;
1	2015-03-11 13:17:12.144988-04	\N		f	1540	1362	f
\.


--
-- Name: feedback_feedbackrequest_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('feedback_feedbackrequest_id_seq', 1, true);


--
-- Data for Name: feedback_feedbacksubmission; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY feedback_feedbacksubmission (id, feedback_date, excels_at, could_improve_on, has_been_delivered, feedback_request_id, reviewer_id, subject_id, confidentiality, unread) FROM stdin;
\.


--
-- Name: feedback_feedbacksubmission_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('feedback_feedbacksubmission_id_seq', 1, false);


--
-- Data for Name: kpi_indicator; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY kpi_indicator (id, name) FROM stdin;
1	Revenue Per Employee
\.


--
-- Name: kpi_indicator_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('kpi_indicator_id_seq', 1, true);


--
-- Data for Name: kpi_performance; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY kpi_performance (id, value, date) FROM stdin;
1	450000.00	2015-01-09 14:56:17.108769-05
\.


--
-- Name: kpi_performance_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('kpi_performance_id_seq', 1, true);


--
-- Data for Name: org_attribute; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY org_attribute (id, employee_id, name, category_id) FROM stdin;
1	1417	Simplifying massive amounts of information	2
5	1366	Tough Conversations	2
2	1417	Project Management	3
3	1396	Swiss Army Knife Coder	2
4	1396	Test Driven Development	3
6	1366	Delivering Feedback	3
7	1366	Negotiations	3
\.


--
-- Name: org_attribute_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('org_attribute_id_seq', 7, true);


--
-- Data for Name: org_attributecategory; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY org_attributecategory (id, name) FROM stdin;
2	Super Power
3	Skill
1	Passion
\.


--
-- Name: org_attributecategory_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('org_attributecategory_id_seq', 3, true);


--
-- Data for Name: org_employee; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY org_employee (id, job_title, hire_date, display, team_id, full_name, avatar, user_id, avatar_small, departure_date, coach_id, first_name, last_name, email, linkedin_id) FROM stdin;
1531	INTERN	2013-04-01	t	13	Nestor Jones	/media/avatars/2013/10/25/male_1.jpg	\N	/media/avatars/2013/10/25/male_1.jpg	\N	\N	\N	\N		\N
1529	INTERN	2013-04-01	t	13	Lula Reid	/media/avatars/2013/10/25/female_1.jpg	\N	/media/avatars/2013/10/25/female_1.jpg	\N	\N	\N	\N		\N
1530	INTERN	2013-04-01	t	13	Roland Fagan	/media/avatars/2013/10/25/male_2.jpg	\N	/media/avatars/2013/10/25/male_2.jpg	\N	\N	\N	\N		\N
1526	ONLINE ANALYST	2013-02-19	t	13	Nancy Coyer	/media/avatars/2013/10/25/female_3.jpg	\N	/media/avatars/2013/10/25/female_3.jpg	\N	\N	\N	\N		\N
1527	OFFICE OPERATIONS	2012-09-19	t	13	Barbara Allen	/media/avatars/2013/10/25/female_4.jpg	\N	/media/avatars/2013/10/25/female_4.jpg	\N	\N	\N	\N		\N
1525	PAYROLL FOOL	2013-01-14	t	13	Ruth Ligon	/media/avatars/2013/10/25/female_5.jpg	\N	/media/avatars/2013/10/25/female_5.jpg	\N	\N	\N	\N		\N
1524	MASTER OF THE HOUSE	2013-01-23	t	13	Mildred Lockwood	/media/avatars/2013/10/25/female_6.jpg	\N	/media/avatars/2013/10/25/female_6.jpg	\N	\N	\N	\N		\N
1523	DEVELOPER I	2013-01-23	t	8	Freda Harmon	/media/avatars/2013/10/25/female_7.jpg	\N	/media/avatars/2013/10/25/female_7.jpg	\N	\N	\N	\N		\N
1522	BUSINESS INTELLIGENCE ANALYST	2013-01-14	t	5	Rosalie Strange	/media/avatars/2013/10/25/female_8.jpg	\N	/media/avatars/2013/10/25/female_8.jpg	\N	\N	\N	\N		\N
1521	MANAGING PREMIUM SERV EDITOR	2007-04-16	t	5	Anna Percy	/media/avatars/2013/10/25/female_9.jpg	\N	/media/avatars/2013/10/25/female_9.jpg	\N	\N	\N	\N		\N
1520		2012-11-12	t	13	James Roby	/media/avatars/2013/10/25/male_3.jpg	\N	/media/avatars/2013/10/25/male_3.jpg	\N	\N	\N	\N		\N
1519		2012-10-29	t	13	Travis Murphy	/media/avatars/2013/10/25/male_4.jpg	\N	/media/avatars/2013/10/25/male_4.jpg	\N	\N	\N	\N		\N
1518	DESKTOP ADMINISTRATOR I	2012-10-29	t	13	Morgan Castillo	/media/avatars/2013/10/25/male_5.jpg	\N	/media/avatars/2013/10/25/male_5.jpg	\N	\N	\N	\N		\N
1517	RECRUITING COORDINATOR	2012-10-23	t	5	Wilfred Smith	/media/avatars/2013/10/25/male_6.jpg	\N	/media/avatars/2013/10/25/male_6.jpg	\N	\N	\N	\N		\N
1516	SECTOR CHIEF	2012-10-08	t	5	Keith Robertson	/media/avatars/2013/10/25/male_7.jpg	\N	/media/avatars/2013/10/25/male_7.jpg	\N	\N	\N	\N		\N
1515	MARKETING DIRECTOR	2012-10-08	t	13	Leonard Weber	/media/avatars/2013/10/25/male_8.jpg	\N	/media/avatars/2013/10/25/male_8.jpg	\N	\N	\N	\N		\N
1513	ONLINE ANALYST I	2012-09-17	t	5	James Gonzales	/media/avatars/2013/10/25/male_9.jpg	\N	/media/avatars/2013/10/25/male_9.jpg	\N	\N	\N	\N		\N
1514	ONLINE ANALYST I	2012-09-17	t	13	Joseph Pate	/media/avatars/2013/10/25/male_10.jpg	\N	/media/avatars/2013/10/25/male_10.jpg	\N	\N	\N	\N		\N
1512	SYSTEMS ENGINEER I	2012-09-06	t	4	Daniel Moore	/media/avatars/2013/10/25/male_11.jpg	\N	/media/avatars/2013/10/25/male_11.jpg	\N	\N	\N	\N		\N
1511	MEMBER SERVICES FOOL	2012-08-20	t	11	William Murdoch	/media/avatars/2013/10/25/male_12.jpg	\N	/media/avatars/2013/10/25/male_12.jpg	\N	\N	\N	\N		\N
1510	BLOG EDITOR & TALENT SCOUT I	2012-08-20	t	12	George Sowers	/media/avatars/2013/10/25/male_13.jpg	\N	/media/avatars/2013/10/25/male_13.jpg	\N	\N	\N	\N		\N
1362	SENIOR ANALYST I	2008-01-14	t	2	Amber Barnes	/media/avatars/2013/10/25/female_45.jpg	4	/media/avatars/2013/10/25/female_45.jpg	\N	\N	\N	\N		\N
1509	MEMBER SERVICES FOOL	2012-07-16	t	11	Robert Stoner	/media/avatars/2013/10/25/male_15.jpg	\N	/media/avatars/2013/10/25/male_15.jpg	\N	\N	\N	\N		\N
1507	DRM DESIGNER	2012-07-09	t	8	Christopher Cooksey	/media/avatars/2013/10/25/male_16.jpg	\N	/media/avatars/2013/10/25/male_16.jpg	\N	\N	\N	\N		\N
1506	MARKETING OPERATIONS MANAGER	2012-07-09	t	8	Aaron Schlenker	/media/avatars/2013/10/25/male_17.jpg	\N	/media/avatars/2013/10/25/male_17.jpg	\N	\N	\N	\N		\N
1505	JR. COPYWRITER	2012-06-18	t	8	Wilfredo Reiff	/media/avatars/2013/10/25/male_18.jpg	\N	/media/avatars/2013/10/25/male_18.jpg	\N	\N	\N	\N		\N
1504	JR. COPYWRITER	2012-06-18	t	8	Tony Stockton	/media/avatars/2013/10/25/male_19.jpg	\N	/media/avatars/2013/10/25/male_19.jpg	\N	\N	\N	\N		\N
1503	JR. COPYWRITER	2012-06-18	t	8	Gregory Walker	/media/avatars/2013/10/25/male_20.jpg	\N	/media/avatars/2013/10/25/male_20.jpg	\N	\N	\N	\N		\N
1502		2012-06-25	t	5	Edwin Fisher	/media/avatars/2013/10/25/male_21.jpg	\N	/media/avatars/2013/10/25/male_21.jpg	\N	\N	\N	\N		\N
1501	ANALYST DEVELOPMENT PROGRAM	2013-01-14	t	2	Andrew Sevilla	/media/avatars/2013/10/25/male_22.jpg	\N	/media/avatars/2013/10/25/male_22.jpg	\N	\N	\N	\N		\N
1500	ONLINE ANALYST I	2012-06-11	t	12	James Whitney	/media/avatars/2013/10/25/male_23.jpg	\N	/media/avatars/2013/10/25/male_23.jpg	\N	\N	\N	\N		\N
1499	BLOG EDITOR	2012-06-11	t	12	Lonnie Landry	/media/avatars/2013/10/25/male_24.jpg	\N	/media/avatars/2013/10/25/male_24.jpg	\N	\N	\N	\N		\N
1497	PREMIUM SERVICES EDITOR	2012-06-04	t	11	James Abrams	/media/avatars/2013/10/25/male_26.jpg	\N	/media/avatars/2013/10/25/male_26.jpg	\N	\N	\N	\N		\N
1496	WEB ANALYST	2012-06-04	t	3	Anthony Crowe	/media/avatars/2013/10/25/male_27.jpg	\N	/media/avatars/2013/10/25/male_27.jpg	\N	\N	\N	\N		\N
1495	MEMBER SERVICES FOOL	2012-04-30	t	11	Antonio Delacruz	/media/avatars/2013/10/25/male_28.jpg	\N	/media/avatars/2013/10/25/male_28.jpg	\N	\N	\N	\N		\N
1494	RETENTION MANAGER	2012-04-30	t	10	Thad Thomas	/media/avatars/2013/10/25/male_29.jpg	\N	/media/avatars/2013/10/25/male_29.jpg	\N	\N	\N	\N		\N
1492	DEVELOPER I	2012-04-30	t	13	Scott Frazier	/media/avatars/2013/10/25/male_30.jpg	\N	/media/avatars/2013/10/25/male_30.jpg	\N	\N	\N	\N		\N
1493	SEO	2012-04-30	t	12	Robert Rogers	/media/avatars/2013/10/25/male_31.jpg	\N	/media/avatars/2013/10/25/male_31.jpg	\N	\N	\N	\N		\N
1491	ONLINE ANALYST I	2012-04-02	t	12	John Cole	/media/avatars/2013/10/25/male_32.jpg	\N	/media/avatars/2013/10/25/male_32.jpg	\N	\N	\N	\N		\N
1489	BLOG EDITOR & TALENT SCOUT II	2012-03-12	t	12	Ronald Bell	/media/avatars/2013/10/25/male_33.jpg	\N	/media/avatars/2013/10/25/male_33.jpg	\N	\N	\N	\N		\N
1490	SR. COPYWRITER I	2007-05-09	t	10	Christopher Crowell	/media/avatars/2013/10/25/male_34.jpg	\N	/media/avatars/2013/10/25/male_34.jpg	\N	\N	\N	\N		\N
1488	OFFICE OPERATIONS	2012-03-12	t	8	Edwin English	/media/avatars/2013/10/25/male_35.jpg	\N	/media/avatars/2013/10/25/male_35.jpg	\N	\N	\N	\N		\N
1487	RESEARCH ANALYST 1	2012-03-13	t	2	Jesus Massey	/media/avatars/2013/10/25/male_36.jpg	\N	/media/avatars/2013/10/25/male_36.jpg	\N	\N	\N	\N		\N
1486	LINUX ENGINEER	2012-02-21	t	4	Frank Fedler	/media/avatars/2013/10/25/male_37.jpg	\N	/media/avatars/2013/10/25/male_37.jpg	\N	\N	\N	\N		\N
1485	STAFF ACCOUNTANT	2012-02-08	t	6	Byron Dewees	/media/avatars/2013/10/25/male_38.jpg	\N	/media/avatars/2013/10/25/male_38.jpg	\N	\N	\N	\N		\N
1484	ONLINE EDITOR	2012-02-13	t	12	Simon Thomas	/media/avatars/2013/10/25/male_39.jpg	\N	/media/avatars/2013/10/25/male_39.jpg	\N	\N	\N	\N		\N
1483	BUDGET ANALYST	2012-02-01	t	6	Nickolas Preston	/media/avatars/2013/10/25/male_40.jpg	\N	/media/avatars/2013/10/25/male_40.jpg	\N	\N	\N	\N		\N
1482		2012-02-20	t	5	Roman Spivey	/media/avatars/2013/10/25/male_41.jpg	\N	/media/avatars/2013/10/25/male_41.jpg	\N	\N	\N	\N		\N
1481	RESEARCH ANALYST 1	2012-01-17	t	2	Stanley Hogan	/media/avatars/2013/10/25/male_42.jpg	\N	/media/avatars/2013/10/25/male_42.jpg	\N	\N	\N	\N		\N
1480	RESEARCH ANALYST 1	2012-01-17	t	2	Del Forrest	/media/avatars/2013/10/25/male_43.jpg	\N	/media/avatars/2013/10/25/male_43.jpg	\N	\N	\N	\N		\N
1479	COPYWRITER	2012-01-09	t	8	James Jones	/media/avatars/2013/10/25/male_44.jpg	\N	/media/avatars/2013/10/25/male_44.jpg	\N	\N	\N	\N		\N
1477		2011-12-12	t	5	John Long	/media/avatars/2013/10/25/male_45.jpg	\N	/media/avatars/2013/10/25/male_45.jpg	\N	\N	\N	\N		\N
1478	MEMBER SERVICES FOOL	2011-12-14	t	11	Brian Huntley	/media/avatars/2013/10/25/male_46.jpg	\N	/media/avatars/2013/10/25/male_46.jpg	\N	\N	\N	\N		\N
1476	MEMBER SERVICES FOOL	2011-12-05	t	11	Brian Solomon	/media/avatars/2013/10/25/male_47.jpg	\N	/media/avatars/2013/10/25/male_47.jpg	\N	\N	\N	\N		\N
1475	SECTOR CHIEF	2011-11-01	t	12	Paul Williams	/media/avatars/2013/10/25/male_48.jpg	\N	/media/avatars/2013/10/25/male_48.jpg	\N	\N	\N	\N		\N
1474		2011-10-03	t	2	Robert Lemieux	/media/avatars/2013/10/25/male_49.jpg	\N	/media/avatars/2013/10/25/male_49.jpg	\N	\N	\N	\N		\N
1473	DRM DESIGNER	2011-10-03	t	8	Antony Hawkins	/media/avatars/2013/10/25/male_50.jpg	\N	/media/avatars/2013/10/25/male_50.jpg	\N	\N	\N	\N		\N
1471	MEMBER SERVICES FOOL	2011-11-07	t	11	Joseph Schultz	/media/avatars/2013/10/25/male_51.jpg	\N	/media/avatars/2013/10/25/male_51.jpg	\N	\N	\N	\N		\N
1472	BUSINESS DEV NY	2011-09-26	t	10	Arnold Kellogg	/media/avatars/2013/10/25/male_52.jpg	\N	/media/avatars/2013/10/25/male_52.jpg	\N	\N	\N	\N		\N
1470	DEPUTY MANAGING EDITOR	2011-09-26	t	12	Virgil Yeager	/media/avatars/2013/10/25/male_53.jpg	\N	/media/avatars/2013/10/25/male_53.jpg	\N	\N	\N	\N		\N
1469	DATA WAREHOUSING ARCHITECT	2011-08-22	t	3	Tim Stephens	/media/avatars/2013/10/25/male_54.jpg	\N	/media/avatars/2013/10/25/male_54.jpg	\N	\N	\N	\N		\N
1468	ONLINE EDITOR	2011-08-16	t	12	Kenneth Decoteau	/media/avatars/2013/10/25/male_55.jpg	\N	/media/avatars/2013/10/25/male_55.jpg	\N	\N	\N	\N		\N
1466	SR USER EXPERIENCE DESIGNER	2011-07-25	t	9	Andrew Kirby	/media/avatars/2013/10/25/male_56.jpg	\N	/media/avatars/2013/10/25/male_56.jpg	\N	\N	\N	\N		\N
1467	DEVELOPER II	2011-07-25	t	13	Jason Turner	/media/avatars/2013/10/25/male_57.jpg	\N	/media/avatars/2013/10/25/male_57.jpg	\N	\N	\N	\N		\N
1465	PREMIUM SERVICES EDITOR	2011-07-25	t	11	Kevin Williams	/media/avatars/2013/10/25/male_58.jpg	\N	/media/avatars/2013/10/25/male_58.jpg	\N	\N	\N	\N		\N
1464	ANALYST DEVELOPMENT PROGRAM	2011-07-11	t	2	Edward Rhodes	/media/avatars/2013/10/25/male_59.jpg	\N	/media/avatars/2013/10/25/male_59.jpg	\N	\N	\N	\N		\N
1463	DESKTOP ADMINISTRATOR I	2011-07-05	t	4	David Looney	/media/avatars/2013/10/25/male_60.jpg	\N	/media/avatars/2013/10/25/male_60.jpg	\N	\N	\N	\N		\N
1462	BLOG LIAISON & TALENT SCOUT	2011-07-11	t	12	Sam Winningham	/media/avatars/2013/10/25/male_61.jpg	\N	/media/avatars/2013/10/25/male_61.jpg	\N	\N	\N	\N		\N
1461	ONLINE EDITOR	2011-06-13	t	12	Richard Burke	/media/avatars/2013/10/25/male_62.jpg	\N	/media/avatars/2013/10/25/male_62.jpg	\N	\N	\N	\N		\N
1460	EXTERNAL MARKETING	2011-05-02	t	8	Kevin Turner	/media/avatars/2013/10/25/male_63.jpg	\N	/media/avatars/2013/10/25/male_63.jpg	\N	\N	\N	\N		\N
1459	ONLINE EDITOR	2011-04-04	t	12	Christopher Morelli	/media/avatars/2013/10/25/male_64.jpg	\N	/media/avatars/2013/10/25/male_64.jpg	\N	\N	\N	\N		\N
1458		1997-07-01	t	10	Myron Gonzalez	/media/avatars/2013/10/25/male_65.jpg	\N	/media/avatars/2013/10/25/male_65.jpg	\N	\N	\N	\N		\N
1457	DIRECTOR TALENT MANAGEMENT	2011-01-18	t	12	Michael Voigt	/media/avatars/2013/10/25/male_66.jpg	\N	/media/avatars/2013/10/25/male_66.jpg	\N	\N	\N	\N		\N
1455	DESKTOP ADMINISTRATOR I	2011-01-24	t	4	David Wilson	/media/avatars/2013/10/25/male_67.jpg	\N	/media/avatars/2013/10/25/male_67.jpg	\N	\N	\N	\N		\N
1456	QUANALYST II	2011-02-28	t	10	Edward Jimenez	/media/avatars/2013/10/25/male_68.jpg	\N	/media/avatars/2013/10/25/male_68.jpg	\N	\N	\N	\N		\N
1454	DESKTOP ADMINISTRATOR I	2011-01-31	t	4	Thomas Reid	/media/avatars/2013/10/25/male_69.jpg	\N	/media/avatars/2013/10/25/male_69.jpg	\N	\N	\N	\N		\N
1453	DEVELOPER II	2011-01-18	t	13	William Adams	/media/avatars/2013/10/25/male_70.jpg	\N	/media/avatars/2013/10/25/male_70.jpg	\N	\N	\N	\N		\N
1451	SYSTEMS ENGINEER II	2008-02-19	t	4	Ramiro Smith	/media/avatars/2013/10/25/male_71.jpg	\N	/media/avatars/2013/10/25/male_71.jpg	\N	\N	\N	\N		\N
1452	VP PROCESS MANAGEMENT	1996-10-14	t	10	Thomas Lau	/media/avatars/2013/10/25/male_72.jpg	\N	/media/avatars/2013/10/25/male_72.jpg	\N	\N	\N	\N		\N
1450	LEAD DESKTOP ADMIN	2004-03-03	t	4	Daniel Lineberry	/media/avatars/2013/10/25/male_73.jpg	\N	/media/avatars/2013/10/25/male_73.jpg	\N	\N	\N	\N		\N
1448	DIRECTOR RETAIL FUNDS	2006-05-01	t	7	John Sweatt	/media/avatars/2013/10/25/male_74.jpg	\N	/media/avatars/2013/10/25/male_74.jpg	\N	\N	\N	\N		\N
1449	SR NETWORK ENGINEER	2000-05-22	t	4	Billy Dennis	/media/avatars/2013/10/25/male_75.jpg	\N	/media/avatars/2013/10/25/male_75.jpg	\N	\N	\N	\N		\N
1447	DIRECTOR BUSINESS RELATIONS	2010-08-02	t	10	Paul Reynolds	/media/avatars/2013/10/25/male_76.jpg	\N	/media/avatars/2013/10/25/male_76.jpg	\N	\N	\N	\N		\N
1446	SENIOR ANALYST III MFAM	2001-12-13	t	7	Steven Crook	/media/avatars/2013/10/25/male_77.jpg	\N	/media/avatars/2013/10/25/male_77.jpg	\N	\N	\N	\N		\N
1445	ANALYST DEVELOPMENT PROGRAM	2010-09-13	t	10	Herman Pearson	/media/avatars/2013/10/25/male_78.jpg	\N	/media/avatars/2013/10/25/male_78.jpg	\N	\N	\N	\N		\N
1444	JR LINUX ENGINEER	2007-05-07	t	4	Robert Lerner	/media/avatars/2013/10/25/male_79.jpg	\N	/media/avatars/2013/10/25/male_79.jpg	\N	\N	\N	\N		\N
1442	CONTROLLER	2005-06-27	t	10	John Ferdinand	/media/avatars/2013/10/25/male_80.jpg	\N	/media/avatars/2013/10/25/male_80.jpg	\N	\N	\N	\N		\N
1443		2005-02-21	t	10	Robert Vanetten	/media/avatars/2013/10/25/male_81.jpg	\N	/media/avatars/2013/10/25/male_81.jpg	\N	\N	\N	\N		\N
1441	ACCOUNTING ANALYST	2010-10-11	t	6	Rafael Figueroa	/media/avatars/2013/10/25/male_82.jpg	\N	/media/avatars/2013/10/25/male_82.jpg	\N	\N	\N	\N		\N
1440	ASSISTANT CONTROLLER	2004-08-30	t	6	Robert Smith	/media/avatars/2013/10/25/male_83.jpg	\N	/media/avatars/2013/10/25/male_83.jpg	\N	\N	\N	\N		\N
1439	ASST. CONTROLLER	2004-08-30	t	6	John Klein	/media/avatars/2013/10/25/male_84.jpg	\N	/media/avatars/2013/10/25/male_84.jpg	\N	\N	\N	\N		\N
1438	EXTERNAL MARKETING MANAGER	1999-09-06	t	10	Fred Limones	/media/avatars/2013/10/25/male_85.jpg	\N	/media/avatars/2013/10/25/male_85.jpg	\N	\N	\N	\N		\N
1437	DIRECTOR	2004-08-30	t	2	James Williams	/media/avatars/2013/10/25/male_86.jpg	\N	/media/avatars/2013/10/25/male_86.jpg	\N	\N	\N	\N		\N
1436	VP MEMBER INSIGHTS	2001-06-22	t	3	Darren Durbin	/media/avatars/2013/10/25/male_87.jpg	\N	/media/avatars/2013/10/25/male_87.jpg	\N	\N	\N	\N		\N
1434		2000-06-05	t	5	Robert Truesdale	/media/avatars/2013/10/25/male_88.jpg	\N	/media/avatars/2013/10/25/male_88.jpg	\N	\N	\N	\N		\N
1435	VP BUS DEVELOPMENT	2003-02-03	t	1	Domingo Ceaser	/media/avatars/2013/10/25/male_89.jpg	\N	/media/avatars/2013/10/25/male_89.jpg	\N	\N	\N	\N		\N
1433		1999-11-22	t	5	Gerardo Edwards	/media/avatars/2013/10/25/male_90.jpg	\N	/media/avatars/2013/10/25/male_90.jpg	\N	\N	\N	\N		\N
1432	SR DW ARCHITECT	1998-06-01	t	3	Earl Colvin	/media/avatars/2013/10/25/male_91.jpg	\N	/media/avatars/2013/10/25/male_91.jpg	\N	\N	\N	\N		\N
1431	VIDEO REPORTER & PRODUCER	2000-05-01	t	12	Steve Fergerson	/media/avatars/2013/10/25/male_92.jpg	\N	/media/avatars/2013/10/25/male_92.jpg	\N	\N	\N	\N		\N
1429		2000-11-20	t	5	Wendell Snow	/media/avatars/2013/10/25/male_93.jpg	\N	/media/avatars/2013/10/25/male_93.jpg	\N	\N	\N	\N		\N
1430	PRESIDENT	1999-08-16	t	2	Jeremy Cox	/media/avatars/2013/10/25/male_94.jpg	\N	/media/avatars/2013/10/25/male_94.jpg	\N	\N	\N	\N		\N
1428	PRESIDENT MFAM	2005-11-14	t	10	Michael Pabst	/media/avatars/2013/10/25/male_95.jpg	\N	/media/avatars/2013/10/25/male_95.jpg	\N	\N	\N	\N		\N
1427	SVP CORPORATE FINANCE	1996-02-16	t	10	Gregory Simpson	/media/avatars/2013/10/25/male_96.jpg	\N	/media/avatars/2013/10/25/male_96.jpg	\N	\N	\N	\N		\N
1426	VP SOFTWARE DEVELOPMENT	1997-06-09	t	10	Jack Hoover	/media/avatars/2013/10/25/male_97.jpg	\N	/media/avatars/2013/10/25/male_97.jpg	\N	\N	\N	\N		\N
1425	DIRECTOR TECH OPERATIONS	2006-08-11	t	4	John Johnson	/media/avatars/2013/10/25/male_98.jpg	\N	/media/avatars/2013/10/25/male_98.jpg	\N	\N	\N	\N		\N
1424	PRODUCER II	2000-01-03	t	12	Robert Pollack	/media/avatars/2013/10/25/male_99.jpg	\N	/media/avatars/2013/10/25/male_99.jpg	\N	\N	\N	\N		\N
1422	MANAGING NEWS EDITOR	2004-07-06	t	12	Carl Oakes	/media/avatars/2013/10/25/male_100.jpg	\N	/media/avatars/2013/10/25/male_100.jpg	\N	\N	\N	\N		\N
1423	ASSOCIATE GENERAL COUNSEL	1998-09-28	t	6	Michael Henry	/media/avatars/2013/10/25/male_101.jpg	\N	/media/avatars/2013/10/25/male_101.jpg	\N	\N	\N	\N		\N
1421	HEAD OF EUROPE & THE AMERICAS	2005-01-31	t	10	Howard Strain	/media/avatars/2013/10/25/male_102.jpg	\N	/media/avatars/2013/10/25/male_102.jpg	\N	\N	\N	\N		\N
1420	PRESIDENT WRITER NETWORK	2004-06-01	t	10	Todd Bertsch	/media/avatars/2013/10/25/male_103.jpg	\N	/media/avatars/2013/10/25/male_103.jpg	\N	\N	\N	\N		\N
1419	ONLINE ANALYST II	2004-08-30	t	12	Jerry Turnage	/media/avatars/2013/10/25/male_104.jpg	\N	/media/avatars/2013/10/25/male_104.jpg	\N	\N	\N	\N		\N
1418	CONTENT EXPERIENCE DESIGNER	2006-04-24	t	10	Raymond McVicker	/media/avatars/2013/10/25/male_105.jpg	\N	/media/avatars/2013/10/25/male_105.jpg	\N	\N	\N	\N		\N
1416	BUSINESS OPERATIONS MANAGER	2005-08-16	t	10	Philip Bible	/media/avatars/2013/10/25/male_107.jpg	\N	/media/avatars/2013/10/25/male_107.jpg	\N	\N	\N	\N		\N
1414	DEVELOPER IV	2006-04-24	t	13	Jeffrey Baker	/media/avatars/2013/10/25/male_108.jpg	\N	/media/avatars/2013/10/25/male_108.jpg	\N	\N	\N	\N		\N
1415	LEAD DEVELOPER I	2005-06-06	t	13	Charles Banks	/media/avatars/2013/10/25/male.jpg	\N	/media/avatars/2013/10/25/male.jpg	\N	\N	\N	\N		\N
1413	QUANALYST I	2005-08-01	t	10	Lawrence Adams	/media/avatars/2013/10/25/male_110.jpg	\N	/media/avatars/2013/10/25/male_110.jpg	\N	\N	\N	\N		\N
1412	BUSINESS INTELLIGENCE ANALYST	2001-01-11	t	3	Henry Rudolph	/media/avatars/2013/10/25/male.jpg	\N	/media/avatars/2013/10/25/male.jpg	\N	\N	\N	\N		\N
1411	EXECUTIVE PRODUCER	1998-08-10	t	12	John Faulkner	/media/avatars/2013/10/25/male_112.jpg	\N	/media/avatars/2013/10/25/male_112.jpg	\N	\N	\N	\N		\N
1409	ADVISOR I	2006-11-24	t	2	Brian Owens	/media/avatars/2013/10/25/male_113.jpg	\N	/media/avatars/2013/10/25/male_113.jpg	\N	\N	\N	\N		\N
1410	ADVISOR II	2004-08-16	t	2	Timothy Silva	/media/avatars/2013/10/25/male_114.jpg	\N	/media/avatars/2013/10/25/male_114.jpg	\N	\N	\N	\N		\N
1408	SENIOR ANALYST I	2005-03-16	t	2	Bobby Bradley	/media/avatars/2013/10/25/male_115.jpg	\N	/media/avatars/2013/10/25/male_115.jpg	\N	\N	\N	\N		\N
1406	ADVISOR II	2007-01-31	t	2	Manuel Cain	/media/avatars/2013/10/25/male_116.jpg	\N	/media/avatars/2013/10/25/male_116.jpg	\N	\N	\N	\N		\N
1407	CDP TA & WRITER LIAISON	2005-05-02	t	12	Ricky Gross	/media/avatars/2013/10/25/male_117.jpg	\N	/media/avatars/2013/10/25/male_117.jpg	\N	\N	\N	\N		\N
1405	BUSINESS INTELLIGENCE ANALYST	2005-02-07	t	3	Herbert Armstrong	/media/avatars/2013/10/25/male_118.jpg	\N	/media/avatars/2013/10/25/male_118.jpg	\N	\N	\N	\N		\N
1403	EXECUTIVE PROJECT MANAGER I	2008-08-18	t	10	Felix Spicer	/media/avatars/2013/10/25/male_119.jpg	\N	/media/avatars/2013/10/25/male_119.jpg	\N	\N	\N	\N		\N
1404	JR DBA	2006-12-11	t	4	Dale Olivas	/media/avatars/2013/10/25/male_120.jpg	\N	/media/avatars/2013/10/25/male_120.jpg	\N	\N	\N	\N		\N
1402	ONLINE EDITOR	2008-09-02	t	12	William Moore	/media/avatars/2013/10/25/male_121.jpg	\N	/media/avatars/2013/10/25/male_121.jpg	\N	\N	\N	\N		\N
1401	ADVISOR V	2001-05-28	t	2	Maurice Lisle	/media/avatars/2013/10/25/male_122.jpg	\N	/media/avatars/2013/10/25/male_122.jpg	\N	\N	\N	\N		\N
1528	SALES DIRECTOR	2013-03-01	t	13	Barbara Long	/media/avatars/2013/10/25/female_2.jpg	6	/media/avatars/2013/10/25/female_2.jpg	\N	\N	\N	\N		\N
1399	SVP BUSINESS DEVELOPMENT	2005-10-24	t	10	Kenneth Tavares	/media/avatars/2013/10/25/male_124.jpg	\N	/media/avatars/2013/10/25/male_124.jpg	\N	\N	\N	\N		\N
1397	QUANTITATIVE ANALYST	2009-01-12	t	3	Olive McDonald	/media/avatars/2013/10/25/female_10.jpg	\N	/media/avatars/2013/10/25/female_10.jpg	\N	\N	\N	\N		\N
1398	INVESTING OPS ADP	2008-07-07	t	2	Tom Shin	/media/avatars/2013/10/25/male_125.jpg	\N	/media/avatars/2013/10/25/male_125.jpg	\N	\N	\N	\N		\N
1395	ONLINE ANALYST I	2008-12-01	t	12	Charlotte Kelly	/media/avatars/2013/10/25/female_11.jpg	\N	/media/avatars/2013/10/25/female_11.jpg	\N	\N	\N	\N		\N
1396	SENIOR ANALYST I MFAM	2008-01-14	t	7	Jennifer Barnes	/media/avatars/2013/10/25/female_12.jpg	\N	/media/avatars/2013/10/25/female_12.jpg	\N	\N	\N	\N		\N
1393	ASSISTANT GENERAL COUNSEL	2005-11-14	t	10	Elsie Overbey	/media/avatars/2013/10/25/female_13.jpg	\N	/media/avatars/2013/10/25/female_13.jpg	\N	\N	\N	\N		\N
1394	DIRECTOR BUSINESS INTELLIGENCE	2006-10-16	t	3	Joann Paulin	/media/avatars/2013/10/25/female_14.jpg	\N	/media/avatars/2013/10/25/female_14.jpg	\N	\N	\N	\N		\N
1391	ENTERPRISE ARCHITECT	2006-09-05	t	13	Lila William	/media/avatars/2013/10/25/female_15.jpg	\N	/media/avatars/2013/10/25/female_15.jpg	\N	\N	\N	\N		\N
1392	MEMBER SERVICES FOOL	2007-05-21	t	11	Elizabeth Tompkins	/media/avatars/2013/10/25/female_16.jpg	\N	/media/avatars/2013/10/25/female_16.jpg	\N	\N	\N	\N		\N
1390	EDITORIAL DIRECTOR	2005-01-10	t	12	Jessica Mosley	/media/avatars/2013/10/25/female_17.jpg	\N	/media/avatars/2013/10/25/female_17.jpg	\N	\N	\N	\N		\N
1389		2009-03-02	t	5	Sabrina Morgan	/media/avatars/2013/10/25/female_18.jpg	\N	/media/avatars/2013/10/25/female_18.jpg	\N	\N	\N	\N		\N
1388	LEGAL ASSISTANT	2008-04-21	t	6	Mary Ramos	/media/avatars/2013/10/25/female_19.jpg	\N	/media/avatars/2013/10/25/female_19.jpg	\N	\N	\N	\N		\N
1386		1999-07-22	t	5	Martha Hong	/media/avatars/2013/10/25/female_20.jpg	\N	/media/avatars/2013/10/25/female_20.jpg	\N	\N	\N	\N		\N
1417	SCRUM MASTER PROJ MANAGER II	2006-01-09	t	10	Christopher Dean	media/avatars/2014/03/26/male_14.jpg	\N	media/avatars/small/2014/03/26/male_14.jpg	\N	\N	\N	\N		\N
1387	SENIOR PREMIUM SERVICES EDITOR	2008-01-07	t	11	Sadie Hayes	/media/avatars/2013/10/25/female_21.jpg	\N	/media/avatars/2013/10/25/female_21.jpg	\N	\N	\N	\N		\N
1385	DIRECTOR RETENTION	2004-06-15	t	10	Aurelia Coffin	/media/avatars/2013/10/25/female_22.jpg	\N	/media/avatars/2013/10/25/female_22.jpg	\N	\N	\N	\N		\N
1384	RESEARCH ANALYST II	2007-10-08	t	2	Debbie Perkins	/media/avatars/2013/10/25/female_23.jpg	\N	/media/avatars/2013/10/25/female_23.jpg	\N	\N	\N	\N		\N
1383	GENERAL COUNSEL	1996-12-02	t	10	Rochelle Martin	/media/avatars/2013/10/25/female_24.jpg	\N	/media/avatars/2013/10/25/female_24.jpg	\N	\N	\N	\N		\N
1382	SENIOR WEB ANALYST	2006-03-06	t	3	Jean Story	/media/avatars/2013/10/25/female_25.jpg	\N	/media/avatars/2013/10/25/female_25.jpg	\N	\N	\N	\N		\N
1381	SENIOR PREMIUM SERVICES EDITOR	2008-12-01	t	11	Carmelita Reynolds	/media/avatars/2013/10/25/female_26.jpg	\N	/media/avatars/2013/10/25/female_26.jpg	\N	\N	\N	\N		\N
1379	LEAD DEVELOPER II	2007-06-18	t	13	Shirley Jones	/media/avatars/2013/10/25/female_27.jpg	\N	/media/avatars/2013/10/25/female_27.jpg	\N	\N	\N	\N		\N
1380	WRITER MANAGER CDP DEAN	2008-03-10	t	12	Lillian Kaufmann	/media/avatars/2013/10/25/female_28.jpg	\N	/media/avatars/2013/10/25/female_28.jpg	\N	\N	\N	\N		\N
1377	MULTIMEDIA PRODUCTION MANAGER	2000-01-18	t	10	Doreen Gould	/media/avatars/2013/10/25/female_29.jpg	\N	/media/avatars/2013/10/25/female_29.jpg	\N	\N	\N	\N		\N
1378	ON AIR TALENT	2000-10-20	t	12	Debra Coleman	/media/avatars/2013/10/25/female_30.jpg	\N	/media/avatars/2013/10/25/female_30.jpg	\N	\N	\N	\N		\N
1376	QUANALYST I	2008-04-28	t	13	Mary Mitchell	/media/avatars/2013/10/25/female_31.jpg	\N	/media/avatars/2013/10/25/female_31.jpg	\N	\N	\N	\N		\N
1374	DESKTOP ADMINISTRATOR II	2008-03-31	t	4	Patty Odum	/media/avatars/2013/10/25/female_32.jpg	\N	/media/avatars/2013/10/25/female_32.jpg	\N	\N	\N	\N		\N
1375	RETENTION ANALYST	2008-09-02	t	10	Yuk Snodgrass	/media/avatars/2013/10/25/female_33.jpg	\N	/media/avatars/2013/10/25/female_33.jpg	\N	\N	\N	\N		\N
1372	SR. COPYWRITER II	2004-11-15	t	10	Annie Pollard	/media/avatars/2013/10/25/female_34.jpg	\N	/media/avatars/2013/10/25/female_34.jpg	\N	\N	\N	\N		\N
1373	WRITER LIAISON	2008-07-14	t	12	Florence Knox	/media/avatars/2013/10/25/female_35.jpg	\N	/media/avatars/2013/10/25/female_35.jpg	\N	\N	\N	\N		\N
1371	VP TECH OPERATIONS	2006-12-04	t	10	Rose Rhodes	/media/avatars/2013/10/25/female_36.jpg	\N	/media/avatars/2013/10/25/female_36.jpg	\N	\N	\N	\N		\N
1369	ADVISOR I	2006-12-06	t	2	Rozanne Adams	/media/avatars/2013/10/25/female_37.jpg	\N	/media/avatars/2013/10/25/female_37.jpg	\N	\N	\N	\N		\N
1370	ONLINE ANALYST I	2008-01-14	t	12	Constance Bryan	/media/avatars/2013/10/25/female_38.jpg	\N	/media/avatars/2013/10/25/female_38.jpg	\N	\N	\N	\N		\N
1367	ONLINE EDITOR	2007-04-02	t	12	Laurie Brown	/media/avatars/2013/10/25/female_39.jpg	\N	/media/avatars/2013/10/25/female_39.jpg	\N	\N	\N	\N		\N
1368	SENIOR PREMIUM SERVICES EDITOR	2006-08-21	t	11	Connie Le	/media/avatars/2013/10/25/female_40.jpg	\N	/media/avatars/2013/10/25/female_40.jpg	\N	\N	\N	\N		\N
1366	DIRECTOR ADP	2008-06-16	t	2	Kia Hayes	/media/avatars/2013/10/25/female_41.jpg	\N	/media/avatars/2013/10/25/female_41.jpg	\N	\N	\N	\N		\N
1365		2007-09-24	t	5	Marie Howland	/media/avatars/2013/10/25/female_42.jpg	\N	/media/avatars/2013/10/25/female_42.jpg	\N	\N	\N	\N		\N
1364	THE CONNECTOR	2007-07-19	t	10	Tina Salmon	/media/avatars/2013/10/25/female_43.jpg	\N	/media/avatars/2013/10/25/female_43.jpg	\N	\N	\N	\N		\N
1363	MARKETING RESEARCH ANALYST	2007-06-11	t	10	Herma Jones	/media/avatars/2013/10/25/female_44.jpg	\N	/media/avatars/2013/10/25/female_44.jpg	\N	\N	\N	\N		\N
1361	SENIOR ANALYST II	2008-01-14	t	2	Kelli Stainbrook	/media/avatars/2013/10/25/female_46.jpg	\N	/media/avatars/2013/10/25/female_46.jpg	\N	\N	\N	\N		\N
1508	VIDEO FOOL	2012-07-05	t	12	Kyle Tucker	media/avatars/2014/03/26/male_106.jpg	\N	media/avatars/small/2014/03/26/male_106.jpg	\N	\N	\N	\N		\N
1359	DIRECTOR RETENTION	2008-03-19	t	10	Gloria Bourne	/media/avatars/2013/10/25/female_48.jpg	\N	/media/avatars/2013/10/25/female_48.jpg	\N	\N	\N	\N		\N
1358	EMAIL OPERATIONS FOOL	1999-09-27	t	11	Amanda Olivera	/media/avatars/2013/10/25/female_49.jpg	\N	/media/avatars/2013/10/25/female_49.jpg	\N	\N	\N	\N		\N
1357	DIRECTOR MEMBER SERVICES	2006-03-01	t	11	Doris Carver	/media/avatars/2013/10/25/female_50.jpg	\N	/media/avatars/2013/10/25/female_50.jpg	\N	\N	\N	\N		\N
1355	ADVISOR	2008-09-16	t	2	Nancy Hill	/media/avatars/2013/10/25/female_51.jpg	\N	/media/avatars/2013/10/25/female_51.jpg	\N	\N	\N	\N		\N
1356	SENIOR ANALYST III MFAM	2011-10-17	t	7	Angelique Thibodeau	/media/avatars/2013/10/25/female_52.jpg	\N	/media/avatars/2013/10/25/female_52.jpg	\N	\N	\N	\N		\N
1354	INTERNATIONAL TECHNOLOGY	2008-03-24	t	10	Patricia Smtih	/media/avatars/2013/10/25/female_53.jpg	\N	/media/avatars/2013/10/25/female_53.jpg	\N	\N	\N	\N		\N
1352	PRODUCER I	2009-11-30	t	12	Cherry Belin	/media/avatars/2013/10/25/female_54.jpg	\N	/media/avatars/2013/10/25/female_54.jpg	\N	\N	\N	\N		\N
1353	SENIOR ANALYST I	2009-07-15	t	2	Sharon Lambert	/media/avatars/2013/10/25/female_55.jpg	\N	/media/avatars/2013/10/25/female_55.jpg	\N	\N	\N	\N		\N
1351	BOARD ADMINISTRATOR	1997-06-02	t	11	Tracy Rodriguez	/media/avatars/2013/10/25/female_56.jpg	\N	/media/avatars/2013/10/25/female_56.jpg	\N	\N	\N	\N		\N
1349	JR QUANALYST	2010-02-09	t	10	Melba Gonzales	/media/avatars/2013/10/25/female_57.jpg	\N	/media/avatars/2013/10/25/female_57.jpg	\N	\N	\N	\N		\N
1350	EMPLOYEE DEV SPECIALIST	2000-05-09	t	10	Linda Brennan	/media/avatars/2013/10/25/female_58.jpg	\N	/media/avatars/2013/10/25/female_58.jpg	\N	\N	\N	\N		\N
1348	WRITER	2003-12-16	t	12	Jewel Atwell	/media/avatars/2013/10/25/female_59.jpg	\N	/media/avatars/2013/10/25/female_59.jpg	\N	\N	\N	\N		\N
1347	RETENTION MANAGER	2007-10-16	t	11	Maureen Schneider	/media/avatars/2013/10/25/female_60.jpg	\N	/media/avatars/2013/10/25/female_60.jpg	\N	\N	\N	\N		\N
1346	BUSINESS DEVELOPMENT FOOL	2007-12-03	t	7	Linda Byrd	/media/avatars/2013/10/25/female_61.jpg	\N	/media/avatars/2013/10/25/female_61.jpg	\N	\N	\N	\N		\N
1345	MEMBER SERVICES OPS MANAGER	2000-02-22	t	10	Ashley Tammaro	/media/avatars/2013/10/25/female_62.jpg	\N	/media/avatars/2013/10/25/female_62.jpg	\N	\N	\N	\N		\N
1344	VP STOCK QUOTES & PORT PAGES	2008-06-17	t	10	Yvonne Rapp	/media/avatars/2013/10/25/female_63.jpg	\N	/media/avatars/2013/10/25/female_63.jpg	\N	\N	\N	\N		\N
1343	RESEARCH ANALYST 1	2009-01-12	t	2	Dorothy Reynolds	/media/avatars/2013/10/25/female_64.jpg	\N	/media/avatars/2013/10/25/female_64.jpg	\N	\N	\N	\N		\N
1342	SCRUM MASTER PROJECT MANAGER I	2006-09-25	t	13	Kellie Summers	/media/avatars/2013/10/25/female_65.jpg	\N	/media/avatars/2013/10/25/female_65.jpg	\N	\N	\N	\N		\N
1341	ADVISOR III	2004-08-16	t	2	Julianne Slade	/media/avatars/2013/10/25/female_66.jpg	\N	/media/avatars/2013/10/25/female_66.jpg	\N	\N	\N	\N		\N
1340	DEVELOPER I	2008-06-09	t	13	Elizabeth Reamer	/media/avatars/2013/10/25/female_67.jpg	\N	/media/avatars/2013/10/25/female_67.jpg	\N	\N	\N	\N		\N
1338	DEVELOPER II	2006-11-16	t	13	Linda Lester	/media/avatars/2013/10/25/female_68.jpg	\N	/media/avatars/2013/10/25/female_68.jpg	\N	\N	\N	\N		\N
1339	FRONT END WEB DEVELOPER	2007-07-02	t	9	Melissa Crumb	/media/avatars/2013/10/25/female_69.jpg	\N	/media/avatars/2013/10/25/female_69.jpg	\N	\N	\N	\N		\N
1337	ADVISOR II	2007-02-05	t	10	Mary Dupre	/media/avatars/2013/10/25/female_70.jpg	\N	/media/avatars/2013/10/25/female_70.jpg	\N	\N	\N	\N		\N
1336	LEAD DEVELOPER I	2006-10-16	t	13	Merry Ware	/media/avatars/2013/10/25/female_71.jpg	\N	/media/avatars/2013/10/25/female_71.jpg	\N	\N	\N	\N		\N
1335	DIRECTOR MEMBER EXPERIENCE	1999-05-05	t	3	Kathleen Johnson	/media/avatars/2013/10/25/female_72.jpg	\N	/media/avatars/2013/10/25/female_72.jpg	\N	\N	\N	\N		\N
1334	WRITER & EDITOR	1997-07-07	t	12	Emily Hawthorn	/media/avatars/2013/10/25/female_73.jpg	\N	/media/avatars/2013/10/25/female_73.jpg	\N	\N	\N	\N		\N
1332	SENIOR RETENTION MANAGER	2003-09-22	t	11	Kelsey Foster	/media/avatars/2013/10/25/female_74.jpg	\N	/media/avatars/2013/10/25/female_74.jpg	\N	\N	\N	\N		\N
1333	SPECIAL PROJECTS	2001-02-26	t	10	Peg Nelson	/media/avatars/2013/10/25/female_75.jpg	\N	/media/avatars/2013/10/25/female_75.jpg	\N	\N	\N	\N		\N
1331	VP BUSINESS DEVELOPMENT	2006-06-20	t	1	Patricia Godwin	/media/avatars/2013/10/25/female_76.jpg	\N	/media/avatars/2013/10/25/female_76.jpg	\N	\N	\N	\N		\N
1330	COLLABORATION FOOL	1998-11-15	t	10	Stephanie Youngman	/media/avatars/2013/10/25/female_77.jpg	\N	/media/avatars/2013/10/25/female_77.jpg	\N	\N	\N	\N		\N
1329	LEAD FEWD	2007-01-03	t	9	Gloria Chappelle	/media/avatars/2013/10/25/female_78.jpg	\N	/media/avatars/2013/10/25/female_78.jpg	\N	\N	\N	\N		\N
1328	MANAGER DRM DESIGN	2008-06-09	t	10	Marguerite McQueen	/media/avatars/2013/10/25/female_79.jpg	\N	/media/avatars/2013/10/25/female_79.jpg	\N	\N	\N	\N		\N
1327	SR FRONT END WEB DEVELOPER	2006-05-22	t	9	Lourdes Londono	/media/avatars/2013/10/25/female_80.jpg	\N	/media/avatars/2013/10/25/female_80.jpg	\N	\N	\N	\N		\N
1326	GRAPHICS EDITOR	2007-04-09	t	12	Betty Lustig	/media/avatars/2013/10/25/female_81.jpg	\N	/media/avatars/2013/10/25/female_81.jpg	\N	\N	\N	\N		\N
1325	SR USER EXPERIENCE DESIGNER II	2007-04-02	t	9	Diane Klein	/media/avatars/2013/10/25/female_82.jpg	\N	/media/avatars/2013/10/25/female_82.jpg	\N	\N	\N	\N		\N
1324	PROJECT MANAGER	2008-09-08	t	9	Ethel Ramos	/media/avatars/2013/10/25/female_83.jpg	\N	/media/avatars/2013/10/25/female_83.jpg	\N	\N	\N	\N		\N
1323	FRONT END WEB DEVELOPER	2009-03-02	t	9	Kristen Brady	/media/avatars/2013/10/25/female_84.jpg	\N	/media/avatars/2013/10/25/female_84.jpg	\N	\N	\N	\N		\N
1322	SR USER EXPERIENCE DESIGNER	2006-03-27	t	9	Leigh McNulty	/media/avatars/2013/10/25/female_85.jpg	\N	/media/avatars/2013/10/25/female_85.jpg	\N	\N	\N	\N		\N
1321	SR FRONT END WEB DEVELOPER II	2007-11-16	t	9	Lisa Burrows	/media/avatars/2013/10/25/female_86.jpg	\N	/media/avatars/2013/10/25/female_86.jpg	\N	\N	\N	\N		\N
1320	TRAINING COORDINATOR	2008-04-28	t	10	Wanda Gallo	/media/avatars/2013/10/25/female_87.jpg	\N	/media/avatars/2013/10/25/female_87.jpg	\N	\N	\N	\N		\N
1319	DIRECTOR USER INTERFACE	2006-03-06	t	10	Paulette Robles	/media/avatars/2013/10/25/female_88.jpg	\N	/media/avatars/2013/10/25/female_88.jpg	\N	\N	\N	\N		\N
1318	SCRUM MASTER PROJECT MANAGER I	2009-08-03	t	13	Brittany Myers	/media/avatars/2013/10/25/female_89.jpg	\N	/media/avatars/2013/10/25/female_89.jpg	\N	\N	\N	\N		\N
1317	VP BUSINESS DEVELOPMENT	1998-11-13	t	1	Cordelia Muse	/media/avatars/2013/10/25/female_90.jpg	\N	/media/avatars/2013/10/25/female_90.jpg	\N	\N	\N	\N		\N
1316	DEVELOPER I	2010-01-11	t	13	Connie Gallup	/media/avatars/2013/10/25/female_91.jpg	\N	/media/avatars/2013/10/25/female_91.jpg	\N	\N	\N	\N		\N
1315	CHIEF INVESTMENT OFFICER	1996-11-18	t	10	Susan Wertz	/media/avatars/2013/10/25/female_92.jpg	\N	/media/avatars/2013/10/25/female_92.jpg	\N	\N	\N	\N		\N
1314	MEMBER SERVICES FOOL	2005-10-04	t	11	Sandra Wade	/media/avatars/2013/10/25/female_93.jpg	\N	/media/avatars/2013/10/25/female_93.jpg	\N	\N	\N	\N		\N
1313	PRODUCTION DESIGNER	2004-02-23	t	9	Lori Dennison	/media/avatars/2013/10/25/female_94.jpg	\N	/media/avatars/2013/10/25/female_94.jpg	\N	\N	\N	\N		\N
1312	EXECUTIVE ASSISTANT	2009-02-09	t	2	Antoinette Robinson	/media/avatars/2013/10/25/female_95.jpg	\N	/media/avatars/2013/10/25/female_95.jpg	\N	\N	\N	\N		\N
1311	RESEARCH ANALYST II	2010-02-22	t	2	Katherine Bowman	/media/avatars/2013/10/25/female_96.jpg	\N	/media/avatars/2013/10/25/female_96.jpg	\N	\N	\N	\N		\N
1310	ADVISOR II	2009-04-13	t	2	Anna Smith	/media/avatars/2013/10/25/female_97.jpg	\N	/media/avatars/2013/10/25/female_97.jpg	\N	\N	\N	\N		\N
1309	GENERAL MANAGER	2008-12-01	t	12	Luisa Carlson	/media/avatars/2013/10/25/female_98.jpg	\N	/media/avatars/2013/10/25/female_98.jpg	\N	\N	\N	\N		\N
1308	RESEARCH ANALYST II	2010-02-22	t	2	Charity Riley	/media/avatars/2013/10/25/female_99.jpg	\N	/media/avatars/2013/10/25/female_99.jpg	\N	\N	\N	\N		\N
1307	PRODUCT MANAGER	2010-02-22	t	10	Crystal Ly	/media/avatars/2013/10/25/female_100.jpg	\N	/media/avatars/2013/10/25/female_100.jpg	\N	\N	\N	\N		\N
1306	LEAD DBA	2008-02-25	t	4	Helen Scott	/media/avatars/2013/10/25/female_101.jpg	\N	/media/avatars/2013/10/25/female_101.jpg	\N	\N	\N	\N		\N
1305	ACCOUNTING MANAGER	2000-12-29	t	6	Susan Petrella	/media/avatars/2013/10/25/female_102.jpg	\N	/media/avatars/2013/10/25/female_102.jpg	\N	\N	\N	\N		\N
1304	SR QUANTITATIVE ANALYST	2008-05-01	t	2	Ellen Ortiz	/media/avatars/2013/10/25/female_103.jpg	\N	/media/avatars/2013/10/25/female_103.jpg	\N	\N	\N	\N		\N
1303	DEVELOPER I	2009-06-08	t	13	Maria Studer	/media/avatars/2013/10/25/female_104.jpg	\N	/media/avatars/2013/10/25/female_104.jpg	\N	\N	\N	\N		\N
1302	RETAIL FUND ASSOCIATE MFAM	2010-05-25	t	7	Brittani Jones	/media/avatars/2013/10/25/female_105.jpg	\N	/media/avatars/2013/10/25/female_105.jpg	\N	\N	\N	\N		\N
1301	ORGANIZATIONAL DEVELOPMENT	2010-05-03	t	10	Billie Gibbons	/media/avatars/2013/10/25/female_106.jpg	\N	/media/avatars/2013/10/25/female_106.jpg	\N	\N	\N	\N		\N
1300	ONLINE ANALYST I	2010-07-19	t	12	Emma Marra	/media/avatars/2013/10/25/female_107.jpg	\N	/media/avatars/2013/10/25/female_107.jpg	\N	\N	\N	\N		\N
1299	ONLINE EDITOR	2010-07-19	t	12	Marilyn Brooks	/media/avatars/2013/10/25/female_108.jpg	\N	/media/avatars/2013/10/25/female_108.jpg	\N	\N	\N	\N		\N
1298	MULTIMEDIA PRODUCER	2010-09-13	t	11	Lori Dejesus	/media/avatars/2013/10/25/female_109.jpg	\N	/media/avatars/2013/10/25/female_109.jpg	\N	\N	\N	\N		\N
1297	FRONT END WEB DEVELOPER	2010-09-13	t	9	Mary Lewis	/media/avatars/2013/10/25/female_110.jpg	\N	/media/avatars/2013/10/25/female_110.jpg	\N	\N	\N	\N		\N
1296	MARKETING COORDINATOR	2010-10-04	t	8	Megan Cunningham	/media/avatars/2013/10/25/female_111.jpg	\N	/media/avatars/2013/10/25/female_111.jpg	\N	\N	\N	\N		\N
1295	EXECUTIVE ASSISTANT	2010-10-11	t	9	Mary Spratt	/media/avatars/2013/10/25/female_112.jpg	\N	/media/avatars/2013/10/25/female_112.jpg	\N	\N	\N	\N		\N
1294	RESEARCH ANALYST 1	2010-11-08	t	2	Carol Smith	/media/avatars/2013/10/25/female_113.jpg	\N	/media/avatars/2013/10/25/female_113.jpg	\N	\N	\N	\N		\N
1293	RESEARCH ANALYST 1	2010-11-08	t	2	Virginia Crabtree	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1292	LEAD NETWORK ENGINEER	2010-10-11	t	4	Katherine Smalls	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1291	SR USER EXPERIENCE DESIGNER	1999-11-22	t	9	Kathleen Calhoon	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1290		2006-03-02	t	5	Linda Simon	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1289	IT VENDOR RELATIONSHIP MANAGER	1999-06-09	t	10	Tina Whitacre	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1288	VP ENTERPRISE ARCHITECTURE	2000-11-10	t	10	Vanessa Gist	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1287	SPECIAL PROJECTS	2006-01-23	t	9	Angela Williams	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1286	FRONT END WEB DEVELOPER	2010-01-04	t	9	Lisa Rocco	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1285	DEVELOPER II	2008-07-21	t	13	Pat Morrison	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1284	LEAD ARCHITECT	2002-04-13	t	13	Robin Vito	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1283	HUMAN RESOURCES MANAGER	2007-10-15	t	6	Yvonne Hensley	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1282	LEAD SYSTEMS ENGINEER	2006-05-31	t	4	Cindy Vess	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1281	SYSTEMS ENGINEER I	2005-07-11	t	4	Amy Haywood	/media/avatars/2013/10/25/female.jpg	\N	/media/avatars/2013/10/25/female.jpg	\N	\N	\N	\N		\N
1532	INTERN	2013-04-01	t	13	Glen Washington	/media/avatars/2013/10/25/male_126.jpg	\N	/media/avatars/2013/10/25/male_126.jpg	\N	\N	\N	\N		\N
1534	INTERN	2013-04-01	t	13	James Fernandez	/media/avatars/2013/10/25/male_128.jpg	\N	/media/avatars/2013/10/25/male_128.jpg	\N	\N	\N	\N		\N
1535	INTERN	2013-01-14	t	13	Paul Colby	/media/avatars/2013/10/25/male_129.jpg	\N	/media/avatars/2013/10/25/male_129.jpg	\N	\N	\N	\N		\N
1537	ANALYST DEVELOPMENT PROGRAM	2013-04-15	t	2	Charles Myers	/media/avatars/2013/10/25/male.jpg	\N	/media/avatars/2013/10/25/male.jpg	\N	\N	\N	\N		\N
1538	ANALYST DEVELOPMENT PROGRAM	2013-04-15	t	2	Barton Vasquez	/media/avatars/2013/10/25/male.jpg	\N	/media/avatars/2013/10/25/male.jpg	\N	\N	\N	\N		\N
1539		2013-05-01	t	5	George Walton	/media/avatars/2013/10/25/male.jpg	\N	/media/avatars/2013/10/25/male.jpg	\N	\N	\N	\N		\N
1360	SR PROJECT MANAGER	1997-01-17	t	13	Deb Turner	/media/avatars/2013/10/25/female_47.jpg	2	/media/avatars/2013/10/25/female_47.jpg	\N	\N	\N	\N		\N
1541	EMAIL MARKETING FOOL	2013-05-29	t	11	Harold Monroe	/media/avatars/2013/10/25/male.jpg	5	/media/avatars/2013/10/25/male.jpg	\N	\N	\N	\N		\N
1540	MEMBER SERVICES FOOL	2013-05-29	t	11	David Lam	/media/avatars/2013/10/25/male.jpg	7	/media/avatars/2013/10/25/male.jpg	\N	\N	\N	\N		\N
1536	ANALYST DEVELOPMENT PROGRAM	2013-04-15	t	2	Robert Wilkins	/media/avatars/2013/10/25/male_130.jpg	8	/media/avatars/2013/10/25/male_130.jpg	\N	\N	\N	\N		\N
1533	INTERN	2013-04-01	t	13	Fred Henninger	/media/avatars/2013/10/25/male_127.jpg	9	/media/avatars/2013/10/25/male_127.jpg	\N	\N	\N	\N		\N
1498	VP MARKETING ANALYTICS	2012-06-04	t	10	Burton Long	/media/avatars/2013/10/25/male_25.jpg	1	/media/avatars/2013/10/25/male_25.jpg	\N	\N			natem@fool.com	
1400	CIO PORTFOLIO MANAGER	1999-08-16	t	11	Armando Williams	/media/avatars/2013/10/25/male_123.jpg	3	/media/avatars/2013/10/25/male_123.jpg	\N	\N	Armando	Williams	mcmahon.nate@gmail.com	\N
\.


--
-- Name: org_employee_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('org_employee_id_seq', 1541, false);


--
-- Data for Name: org_leadership; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY org_leadership (id, leader_id, employee_id, end_date, start_date) FROM stdin;
1	1426	1531	\N	2014-02-24
2	1426	1529	\N	2014-02-24
3	1426	1530	\N	2014-02-24
4	1428	1528	\N	2014-02-24
5	1516	1526	\N	2014-02-24
6	1524	1527	\N	2014-02-24
7	1440	1525	\N	2014-02-24
8	1541	1524	\N	2014-02-24
9	1415	1523	\N	2014-02-24
10	1394	1522	\N	2014-02-24
11	1359	1521	\N	2014-02-24
12	1458	1520	\N	2014-02-24
13	1434	1519	\N	2014-02-24
14	1450	1518	\N	2014-02-24
15	1301	1517	\N	2014-02-24
16	1309	1516	\N	2014-02-24
17	1541	1515	\N	2014-02-24
18	1309	1513	\N	2014-02-24
19	1475	1514	\N	2014-02-24
20	1282	1512	\N	2014-02-24
21	1357	1511	\N	2014-02-24
22	1489	1510	\N	2014-02-24
23	1470	1508	\N	2014-02-24
24	1357	1509	\N	2014-02-24
25	1328	1507	\N	2014-02-24
26	1438	1506	\N	2014-02-24
27	1372	1505	\N	2014-02-24
28	1372	1504	\N	2014-02-24
29	1372	1503	\N	2014-02-24
30	1458	1502	\N	2014-02-24
31	1366	1501	\N	2014-02-24
32	1494	1500	\N	2014-02-24
33	1489	1499	\N	2014-02-24
34	1541	1498	\N	2014-02-24
35	1387	1497	\N	2014-02-24
36	1394	1496	\N	2014-02-24
37	1357	1495	\N	2014-02-24
38	1541	1494	\N	2014-02-24
39	1379	1492	\N	2014-02-24
40	1390	1493	\N	2014-02-24
41	1309	1491	\N	2014-02-24
42	1420	1489	\N	2014-02-24
43	1541	1490	\N	2014-02-24
44	1524	1488	\N	2014-02-24
45	1362	1487	\N	2014-02-24
46	1292	1486	\N	2014-02-24
47	1440	1485	\N	2014-02-24
48	1309	1484	\N	2014-02-24
49	1442	1483	\N	2014-02-24
50	1458	1482	\N	2014-02-24
51	1362	1481	\N	2014-02-24
52	1361	1480	\N	2014-02-24
53	1372	1479	\N	2014-02-24
54	1386	1477	\N	2014-02-24
55	1357	1478	\N	2014-02-24
56	1357	1476	\N	2014-02-24
57	1309	1475	\N	2014-02-24
58	1315	1474	\N	2014-02-24
59	1328	1473	\N	2014-02-24
60	1357	1471	\N	2014-02-24
61	1541	1472	\N	2014-02-24
62	1421	1470	\N	2014-02-24
63	1394	1469	\N	2014-02-24
64	1475	1468	\N	2014-02-24
65	1319	1466	\N	2014-02-24
66	1284	1467	\N	2014-02-24
67	1521	1465	\N	2014-02-24
68	1366	1464	\N	2014-02-24
69	1450	1463	\N	2014-02-24
70	1420	1462	\N	2014-02-24
71	1475	1461	\N	2014-02-24
72	1438	1460	\N	2014-02-24
73	1309	1459	\N	2014-02-24
74	1541	1458	\N	2014-02-24
75	1470	1457	\N	2014-02-24
76	1450	1455	\N	2014-02-24
77	1541	1456	\N	2014-02-24
78	1450	1454	\N	2014-02-24
79	1336	1453	\N	2014-02-24
80	1282	1451	\N	2014-02-24
81	1541	1452	\N	2014-02-24
82	1425	1450	\N	2014-02-24
83	1428	1448	\N	2014-02-24
84	1292	1449	\N	2014-02-24
85	1541	1447	\N	2014-02-24
86	1400	1446	\N	2014-02-24
87	1541	1445	\N	2014-02-24
88	1292	1444	\N	2014-02-24
89	1541	1442	\N	2014-02-24
90	1541	1443	\N	2014-02-24
91	1442	1441	\N	2014-02-24
92	1442	1440	\N	2014-02-24
93	1442	1439	\N	2014-02-24
94	1541	1438	\N	2014-02-24
95	1315	1437	\N	2014-02-24
96	1498	1436	\N	2014-02-24
97	1458	1434	\N	2014-02-24
98	1399	1435	\N	2014-02-24
99	1386	1433	\N	2014-02-24
100	1394	1432	\N	2014-02-24
101	1411	1431	\N	2014-02-24
102	1386	1429	\N	2014-02-24
103	1315	1430	\N	2014-02-24
104	1541	1428	\N	2014-02-24
105	1541	1427	\N	2014-02-24
106	1541	1426	\N	2014-02-24
107	1371	1425	\N	2014-02-24
108	1411	1424	\N	2014-02-24
109	1421	1422	\N	2014-02-24
110	1383	1423	\N	2014-02-24
111	1541	1421	\N	2014-02-24
112	1541	1420	\N	2014-02-24
113	1390	1419	\N	2014-02-24
114	1541	1418	\N	2014-02-24
115	1541	1417	\N	2014-02-24
116	1541	1416	\N	2014-02-24
117	1379	1414	\N	2014-02-24
118	1426	1415	\N	2014-02-24
119	1541	1413	\N	2014-02-24
120	1394	1412	\N	2014-02-24
121	1421	1411	\N	2014-02-24
122	1315	1409	\N	2014-02-24
123	1315	1410	\N	2014-02-24
124	1361	1408	\N	2014-02-24
125	1315	1406	\N	2014-02-24
126	1380	1407	\N	2014-02-24
127	1394	1405	\N	2014-02-24
128	1541	1403	\N	2014-02-24
129	1306	1404	\N	2014-02-24
130	1309	1402	\N	2014-02-24
131	1315	1401	\N	2014-02-24
132	1541	1400	\N	2014-02-24
133	1541	1399	\N	2014-02-24
134	1498	1397	\N	2014-02-24
135	1315	1398	\N	2014-02-24
136	1494	1395	\N	2014-02-24
137	1400	1396	\N	2014-02-24
138	1541	1393	\N	2014-02-24
139	1498	1394	\N	2014-02-24
140	1288	1391	\N	2014-02-24
141	1357	1392	\N	2014-02-24
142	1421	1390	\N	2014-02-24
143	1290	1389	\N	2014-02-24
144	1383	1388	\N	2014-02-24
145	1290	1386	\N	2014-02-24
146	1385	1387	\N	2014-02-24
147	1541	1385	\N	2014-02-24
148	1362	1384	\N	2014-02-24
149	1541	1383	\N	2014-02-24
150	1394	1382	\N	2014-02-24
151	1521	1381	\N	2014-02-24
152	1426	1379	\N	2014-02-24
153	1420	1380	\N	2014-02-24
154	1541	1377	\N	2014-02-24
155	1411	1378	\N	2014-02-24
156	1324	1376	\N	2014-02-24
157	1450	1374	\N	2014-02-24
158	1541	1375	\N	2014-02-24
159	1541	1372	\N	2014-02-24
160	1380	1373	\N	2014-02-24
161	1541	1371	\N	2014-02-24
162	1315	1369	\N	2014-02-24
163	1390	1370	\N	2014-02-24
164	1422	1367	\N	2014-02-24
165	1387	1368	\N	2014-02-24
166	1315	1366	\N	2014-02-24
167	1419	1365	\N	2014-02-24
168	1541	1364	\N	2014-02-24
169	1541	1363	\N	2014-02-24
170	1315	1362	\N	2014-02-24
171	1315	1361	\N	2014-02-24
172	1288	1360	\N	2014-02-24
173	1541	1359	\N	2014-02-24
174	1345	1358	\N	2014-02-24
175	1345	1357	\N	2014-02-24
176	1315	1355	\N	2014-02-24
177	1400	1356	\N	2014-02-24
178	1541	1354	\N	2014-02-24
179	1411	1352	\N	2014-02-24
180	1361	1353	\N	2014-02-24
181	1359	1351	\N	2014-02-24
182	1354	1349	\N	2014-02-24
183	1541	1350	\N	2014-02-24
184	1380	1348	\N	2014-02-24
185	1359	1347	\N	2014-02-24
186	1528	1346	\N	2014-02-24
187	1541	1345	\N	2014-02-24
188	1541	1344	\N	2014-02-24
189	1362	1343	\N	2014-02-24
190	1288	1342	\N	2014-02-24
191	1315	1341	\N	2014-02-24
192	1415	1340	\N	2014-02-24
193	1336	1338	\N	2014-02-24
194	1329	1339	\N	2014-02-24
195	1541	1337	\N	2014-02-24
196	1426	1336	\N	2014-02-24
197	1498	1335	\N	2014-02-24
198	1422	1334	\N	2014-02-24
199	1385	1332	\N	2014-02-24
200	1541	1333	\N	2014-02-24
201	1399	1331	\N	2014-02-24
202	1541	1330	\N	2014-02-24
203	1319	1329	\N	2014-02-24
204	1541	1328	\N	2014-02-24
205	1329	1327	\N	2014-02-24
206	1390	1326	\N	2014-02-24
207	1319	1325	\N	2014-02-24
208	1452	1324	\N	2014-02-24
209	1329	1323	\N	2014-02-24
210	1319	1322	\N	2014-02-24
211	1329	1321	\N	2014-02-24
212	1541	1320	\N	2014-02-24
213	1541	1319	\N	2014-02-24
214	1288	1318	\N	2014-02-24
215	1399	1317	\N	2014-02-24
216	1379	1316	\N	2014-02-24
217	1541	1315	\N	2014-02-24
218	1357	1314	\N	2014-02-24
219	1319	1313	\N	2014-02-24
220	1315	1312	\N	2014-02-24
221	1362	1311	\N	2014-02-24
222	1315	1310	\N	2014-02-24
223	1421	1309	\N	2014-02-24
224	1361	1308	\N	2014-02-24
225	1541	1307	\N	2014-02-24
226	1425	1306	\N	2014-02-24
227	1440	1305	\N	2014-02-24
228	1307	1304	\N	2014-02-24
229	1415	1303	\N	2014-02-24
230	1448	1302	\N	2014-02-24
231	1541	1301	\N	2014-02-24
232	1309	1300	\N	2014-02-24
233	1494	1299	\N	2014-02-24
234	1345	1298	\N	2014-02-24
235	1329	1297	\N	2014-02-24
236	1515	1296	\N	2014-02-24
237	1333	1295	\N	2014-02-24
238	1361	1294	\N	2014-02-24
239	1362	1293	\N	2014-02-24
240	1425	1292	\N	2014-02-24
241	1319	1291	\N	2014-02-24
242	1458	1290	\N	2014-02-24
243	1541	1289	\N	2014-02-24
244	1541	1288	\N	2014-02-24
245	1319	1287	\N	2014-02-24
246	1329	1286	\N	2014-02-24
247	1415	1285	\N	2014-02-24
248	1288	1284	\N	2014-02-24
249	1442	1283	\N	2014-02-24
250	1425	1282	\N	2014-02-24
251	1282	1281	\N	2014-02-24
252	1426	1532	\N	2014-02-24
253	1426	1533	\N	2014-02-24
254	1426	1534	\N	2014-02-24
255	1426	1535	\N	2014-02-24
256	1366	1536	\N	2014-02-24
257	1366	1537	\N	2014-02-24
258	1366	1538	\N	2014-02-24
259	1458	1539	\N	2014-02-24
260	1357	1540	\N	2014-02-24
261	1524	1541	\N	2014-02-24
\.


--
-- Name: org_leadership_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('org_leadership_id_seq', 261, true);


--
-- Data for Name: org_mentorship; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY org_mentorship (id, mentor_id, mentee_id) FROM stdin;
\.


--
-- Name: org_mentorship_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('org_mentorship_id_seq', 1, false);


--
-- Data for Name: org_team; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY org_team (id, name, leader_id) FROM stdin;
1	Business Development	\N
2	Business Intelligence	\N
3	Customer Service	\N
4	Engineering	\N
5	Finance and Accounting	\N
6	Human Resources	\N
7	Legal	\N
8	Marketing	\N
9	Operations	\N
10	Partner Services	\N
11	Product Development	\N
12	Research and Development	\N
13	Software Engineering	\N
\.


--
-- Name: org_team_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('org_team_id_seq', 14, false);


--
-- Data for Name: preferences_sitepreferences; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY preferences_sitepreferences (id, show_kolbe, show_vops, show_mbti, show_coaches, site_id, show_timeline, survey_email_body, survey_email_subject) FROM stdin;
1	f	f	f	t	1	f	We want to make sure we stay on top of your needs and that you have the opportunity to do your best work every day.\r\n\r\nYou are super busy and work your butt off. We don't want to get in your way. So we've devised One lightning-quick multiple-choice question… which you can expound upon if you’d like in the box below it.\r\n\r\nThis is not anonymous, because our goal here is to help YOU. It'll just take 8 short seconds (or a little more, if you have time).	How's it going?
\.


--
-- Name: preferences_sitepreferences_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('preferences_sitepreferences_id_seq', 1, true);


--
-- Data for Name: pvp_evaluationround; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY pvp_evaluationround (id, date, is_complete) FROM stdin;
1	2008-10-26	t
2	2009-03-04	t
3	2010-08-03	t
4	2011-02-01	t
5	2011-07-30	t
6	2012-01-31	t
7	2012-07-10	t
8	2012-12-18	t
9	2013-06-12	t
10	2015-02-25	f
\.


--
-- Name: pvp_evaluationround_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('pvp_evaluationround_id_seq', 10, true);


--
-- Data for Name: pvp_pvpdescription; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY pvp_pvpdescription (id, potential, performance, description) FROM stdin;
1	0	0	The benchmarks you use for assessing performance and potential are largely up to you. You will see we''ve provided some guidelines. Click the grid to get started.
2	4	4	Excels in current role and utilizes their skills outside of their current role in exceptional ways.
3	3	4	Excels in current role and utilizes their skills outside of their current role.
4	2	4	Excels in current role and can demonstrate initiative outside their role when provoked.
5	1	4	Excels in current role but unable or unwilling to expand into other roles.
6	4	3	Meets expectations for the role and utilizes their skills outside of their current role in exceptional ways.
7	3	3	Meets expectations for the role and utilizes their skills outside of their current role.
8	2	3	Meets expectations for the role and can demonstrate initiative outside their role when provoked.
9	1	3	Meets expectations for the role but unable or unwilling to expand into other roles.
14	3	2	Provides lower than expected contributions in current role but utilizes their skills outside of their current role.
15	2	2	Provides lower than expected contributions in current role but can demonstrate initiative outside their role when provoked.
16	1	2	Provides lower than expected contributions in current role and unable or unwilling to expand into other roles.
17	4	1	Provides little to no value in current role but utilizes their skills outside of their current role in exceptional ways.
18	3	1	Provides little to no value in current role but utilizes their skills outside of their current role.
19	2	1	Provides little to no value in current role but can demonstrate initiative outside their role when provoked.
20	1	1	Provides little to no value in current role and unable or unwilling to expand into other roles.
13	4	2	Provides lower than expected contributions in current role but utilizes their skills outside of their current role in exceptional ways.
\.


--
-- Name: pvp_pvpdescription_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('pvp_pvpdescription_id_seq', 20, true);


--
-- Data for Name: pvp_pvpevaluation; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY pvp_pvpevaluation (id, employee_id, evaluation_round_id, potential, performance, evaluator_id, is_complete, comment_id) FROM stdin;
1	1281	9	3	4	\N	f	\N
2	1281	8	3	4	\N	f	\N
3	1281	7	3	4	\N	f	\N
4	1281	6	3	4	\N	f	\N
5	1281	5	2	4	\N	f	\N
6	1281	4	3	3	\N	f	\N
7	1281	3	3	3	\N	f	\N
9	1281	2	3	3	\N	f	\N
10	1281	1	3	4	\N	f	\N
11	1282	9	3	3	\N	f	\N
12	1282	8	3	3	\N	f	\N
13	1282	7	2	3	\N	f	\N
14	1282	6	3	4	\N	f	\N
15	1282	5	2	3	\N	f	\N
16	1282	4	2	3	\N	f	\N
17	1282	3	4	3	\N	f	\N
19	1282	2	3	4	\N	f	\N
20	1282	1	3	3	\N	f	\N
21	1283	9	4	4	\N	f	\N
22	1283	8	3	4	\N	f	\N
23	1283	7	3	4	\N	f	\N
24	1283	6	3	4	\N	f	\N
25	1283	5	2	4	\N	f	\N
26	1283	4	2	4	\N	f	\N
27	1283	3	2	4	\N	f	\N
29	1283	2	3	4	\N	f	\N
30	1283	1	2	4	\N	f	\N
31	1284	9	3	4	\N	f	\N
32	1284	8	3	4	\N	f	\N
33	1284	6	3	3	\N	f	\N
34	1284	5	3	4	\N	f	\N
35	1284	4	4	3	\N	f	\N
36	1284	3	4	4	\N	f	\N
38	1284	2	4	4	\N	f	\N
39	1284	1	4	4	\N	f	\N
40	1285	9	3	4	\N	f	\N
41	1285	8	3	4	\N	f	\N
42	1285	6	2	4	\N	f	\N
43	1285	4	3	3	\N	f	\N
44	1285	3	3	3	\N	f	\N
46	1285	2	3	3	\N	f	\N
47	1285	1	3	3	\N	f	\N
48	1286	9	2	3	\N	f	\N
49	1286	8	2	3	\N	f	\N
50	1286	6	2	3	\N	f	\N
51	1286	5	3	3	\N	f	\N
52	1286	4	3	3	\N	f	\N
53	1287	9	3	3	\N	f	\N
54	1287	8	3	3	\N	f	\N
55	1287	6	3	3	\N	f	\N
56	1287	5	3	3	\N	f	\N
57	1287	4	3	3	\N	f	\N
58	1287	3	4	3	\N	f	\N
60	1287	2	3	3	\N	f	\N
61	1287	1	3	3	\N	f	\N
62	1288	9	3	3	\N	f	\N
63	1288	4	4	4	\N	f	\N
64	1288	3	4	4	\N	f	\N
66	1288	2	4	3	\N	f	\N
67	1289	9	3	4	\N	f	\N
68	1289	8	4	4	\N	f	\N
69	1289	7	4	4	\N	f	\N
70	1289	6	4	4	\N	f	\N
71	1289	5	4	4	\N	f	\N
72	1289	4	4	4	\N	f	\N
73	1289	2	3	4	\N	f	\N
74	1289	1	2	4	\N	f	\N
75	1290	9	3	4	\N	f	\N
76	1290	8	3	4	\N	f	\N
77	1290	6	3	3	\N	f	\N
78	1290	5	4	3	\N	f	\N
79	1290	4	4	4	\N	f	\N
80	1290	3	3	4	\N	f	\N
82	1290	2	4	4	\N	f	\N
83	1290	1	4	4	\N	f	\N
84	1291	9	1	2	\N	f	\N
85	1291	8	1	3	\N	f	\N
86	1291	7	1	3	\N	f	\N
87	1291	6	1	3	\N	f	\N
88	1291	5	2	3	\N	f	\N
89	1291	4	2	2	\N	f	\N
90	1291	3	3	3	\N	f	\N
92	1291	2	2	3	\N	f	\N
93	1291	1	2	3	\N	f	\N
94	1292	9	4	4	\N	f	\N
95	1292	8	3	4	\N	f	\N
96	1292	7	3	4	\N	f	\N
97	1292	6	3	3	\N	f	\N
98	1292	5	3	4	\N	f	\N
99	1292	4	3	4	\N	f	\N
100	1293	9	3	3	\N	f	\N
101	1293	8	3	2	\N	f	\N
102	1293	7	3	3	\N	f	\N
103	1293	6	4	3	\N	f	\N
104	1293	5	4	3	\N	f	\N
105	1294	9	3	3	\N	f	\N
106	1294	8	4	3	\N	f	\N
107	1294	7	3	3	\N	f	\N
108	1294	6	3	3	\N	f	\N
109	1294	5	4	3	\N	f	\N
110	1295	9	2	2	\N	f	\N
111	1295	7	1	3	\N	f	\N
112	1295	6	3	3	\N	f	\N
113	1295	4	2	3	\N	f	\N
114	1296	8	2	3	\N	f	\N
115	1296	7	2	2	\N	f	\N
116	1296	5	4	3	\N	f	\N
117	1296	4	3	3	\N	f	\N
118	1297	9	3	3	\N	f	\N
119	1297	8	3	3	\N	f	\N
120	1297	7	3	3	\N	f	\N
121	1297	6	3	3	\N	f	\N
122	1297	5	2	3	\N	f	\N
123	1297	4	3	2	\N	f	\N
124	1298	9	2	3	\N	f	\N
125	1298	8	2	3	\N	f	\N
126	1298	6	3	3	\N	f	\N
127	1298	5	3	4	\N	f	\N
128	1298	4	3	4	\N	f	\N
129	1299	9	3	3	\N	f	\N
130	1299	8	3	3	\N	f	\N
131	1299	7	4	4	\N	f	\N
132	1299	6	3	3	\N	f	\N
133	1299	5	2	2	\N	f	\N
134	1299	4	3	3	\N	f	\N
135	1299	3	3	3	\N	f	\N
136	1300	9	4	4	\N	f	\N
137	1300	8	4	4	\N	f	\N
138	1300	7	4	4	\N	f	\N
139	1300	6	2	3	\N	f	\N
140	1300	5	2	2	\N	f	\N
141	1300	4	3	3	\N	f	\N
142	1300	3	3	3	\N	f	\N
143	1301	8	3	4	\N	f	\N
144	1301	4	4	3	\N	f	\N
145	1302	9	3	4	\N	f	\N
146	1302	8	3	4	\N	f	\N
147	1302	7	3	4	\N	f	\N
148	1302	5	3	3	\N	f	\N
149	1302	4	3	3	\N	f	\N
150	1303	9	2	3	\N	f	\N
151	1303	8	2	3	\N	f	\N
152	1303	7	3	3	\N	f	\N
153	1303	6	3	3	\N	f	\N
154	1303	5	3	3	\N	f	\N
155	1303	4	4	4	\N	f	\N
156	1303	3	3	3	\N	f	\N
157	1304	9	3	4	\N	f	\N
158	1304	8	3	4	\N	f	\N
159	1304	7	3	3	\N	f	\N
160	1304	5	4	3	\N	f	\N
161	1304	3	4	4	\N	f	\N
163	1304	2	4	4	\N	f	\N
164	1304	1	4	4	\N	f	\N
165	1305	9	2	3	\N	f	\N
166	1305	8	2	4	\N	f	\N
167	1305	7	2	4	\N	f	\N
168	1305	6	2	4	\N	f	\N
169	1305	5	2	4	\N	f	\N
170	1305	4	2	4	\N	f	\N
171	1305	3	2	4	\N	f	\N
172	1305	2	2	3	\N	f	\N
173	1305	1	2	3	\N	f	\N
174	1306	9	3	4	\N	f	\N
175	1306	8	2	4	\N	f	\N
176	1306	7	2	4	\N	f	\N
177	1306	6	2	3	\N	f	\N
178	1306	5	4	3	\N	f	\N
179	1306	4	4	3	\N	f	\N
180	1306	3	3	3	\N	f	\N
182	1306	2	2	3	\N	f	\N
183	1306	1	2	3	\N	f	\N
184	1307	9	4	4	\N	f	\N
185	1307	8	4	4	\N	f	\N
186	1307	7	3	3	\N	f	\N
187	1307	5	4	3	\N	f	\N
188	1307	3	3	3	\N	f	\N
189	1308	9	3	4	\N	f	\N
190	1308	8	3	4	\N	f	\N
191	1308	7	4	3	\N	f	\N
192	1308	6	3	3	\N	f	\N
193	1308	5	3	3	\N	f	\N
194	1308	3	3	3	\N	f	\N
195	1309	9	4	4	\N	f	\N
196	1309	8	4	4	\N	f	\N
197	1309	7	4	4	\N	f	\N
198	1309	6	4	4	\N	f	\N
199	1309	5	4	2	\N	f	\N
200	1309	4	4	3	\N	f	\N
201	1309	3	3	3	\N	f	\N
203	1309	2	2	3	\N	f	\N
204	1310	9	3	4	\N	f	\N
205	1310	8	3	3	\N	f	\N
206	1310	7	3	3	\N	f	\N
207	1310	6	3	4	\N	f	\N
208	1310	5	3	4	\N	f	\N
209	1310	3	4	3	\N	f	\N
210	1311	9	4	4	\N	f	\N
211	1311	8	4	4	\N	f	\N
212	1311	7	4	4	\N	f	\N
213	1311	6	4	3	\N	f	\N
214	1311	5	4	3	\N	f	\N
215	1311	3	4	3	\N	f	\N
216	1312	9	2	2	\N	f	\N
217	1312	8	2	3	\N	f	\N
218	1312	7	2	2	\N	f	\N
219	1312	6	3	1	\N	f	\N
220	1312	5	3	3	\N	f	\N
221	1312	4	3	3	\N	f	\N
222	1312	3	2	3	\N	f	\N
223	1312	2	2	3	\N	f	\N
224	1313	9	1	3	\N	f	\N
225	1313	8	1	3	\N	f	\N
226	1313	7	1	3	\N	f	\N
227	1313	6	1	3	\N	f	\N
228	1313	5	2	3	\N	f	\N
229	1313	4	2	2	\N	f	\N
230	1313	3	3	4	\N	f	\N
231	1313	2	2	3	\N	f	\N
232	1313	1	1	3	\N	f	\N
233	1314	9	1	4	\N	f	\N
234	1314	8	1	4	\N	f	\N
235	1314	7	1	4	\N	f	\N
236	1314	6	2	4	\N	f	\N
237	1314	5	2	4	\N	f	\N
238	1314	4	2	4	\N	f	\N
239	1314	3	2	4	\N	f	\N
240	1314	2	2	4	\N	f	\N
241	1314	1	2	4	\N	f	\N
242	1315	9	4	4	\N	f	\N
243	1315	3	4	4	\N	f	\N
245	1315	2	4	4	\N	f	\N
246	1315	1	4	4	\N	f	\N
247	1316	9	2	3	\N	f	\N
248	1316	8	2	3	\N	f	\N
249	1316	7	2	3	\N	f	\N
250	1316	6	3	4	\N	f	\N
251	1316	5	3	3	\N	f	\N
252	1316	4	3	3	\N	f	\N
253	1316	3	3	2	\N	f	\N
254	1317	9	2	3	\N	f	\N
255	1317	8	3	3	\N	f	\N
256	1317	7	2	3	\N	f	\N
257	1317	5	3	3	\N	f	\N
258	1317	4	3	3	\N	f	\N
259	1318	9	3	4	\N	f	\N
260	1318	8	4	4	\N	f	\N
261	1318	6	4	4	\N	f	\N
262	1318	5	4	4	\N	f	\N
263	1318	4	3	4	\N	f	\N
264	1318	3	3	4	\N	f	\N
266	1319	9	3	3	\N	f	\N
267	1319	4	4	3	\N	f	\N
268	1319	3	4	3	\N	f	\N
270	1319	2	4	4	\N	f	\N
271	1319	1	4	4	\N	f	\N
272	1320	8	3	3	\N	f	\N
273	1320	5	3	3	\N	f	\N
274	1320	4	4	3	\N	f	\N
275	1320	3	2	4	\N	f	\N
277	1320	2	3	3	\N	f	\N
278	1320	1	2	3	\N	f	\N
279	1321	9	4	4	\N	f	\N
280	1321	8	4	4	\N	f	\N
281	1321	7	4	4	\N	f	\N
282	1321	6	4	4	\N	f	\N
283	1321	5	4	4	\N	f	\N
284	1321	4	4	4	\N	f	\N
285	1321	3	4	4	\N	f	\N
287	1321	2	4	4	\N	f	\N
288	1321	1	3	3	\N	f	\N
289	1322	9	3	3	\N	f	\N
290	1322	8	3	2	\N	f	\N
291	1322	7	3	2	\N	f	\N
292	1322	6	3	3	\N	f	\N
293	1322	5	4	3	\N	f	\N
294	1322	4	3	3	\N	f	\N
295	1322	3	4	3	\N	f	\N
297	1322	2	3	3	\N	f	\N
298	1322	1	3	3	\N	f	\N
299	1323	9	2	2	\N	f	\N
300	1323	8	2	4	\N	f	\N
301	1323	7	2	4	\N	f	\N
302	1323	6	1	3	\N	f	\N
303	1323	5	2	3	\N	f	\N
304	1323	4	2	3	\N	f	\N
305	1323	3	3	3	\N	f	\N
307	1324	9	3	3	\N	f	\N
308	1324	8	4	2	\N	f	\N
309	1324	7	2	3	\N	f	\N
310	1324	6	3	3	\N	f	\N
311	1324	5	3	3	\N	f	\N
312	1324	4	3	3	\N	f	\N
313	1324	3	3	3	\N	f	\N
315	1324	2	3	3	\N	f	\N
316	1324	1	2	3	\N	f	\N
317	1325	9	4	4	\N	f	\N
318	1325	8	4	4	\N	f	\N
319	1325	7	4	4	\N	f	\N
320	1325	6	4	4	\N	f	\N
321	1325	5	4	4	\N	f	\N
322	1325	4	4	4	\N	f	\N
323	1325	3	3	4	\N	f	\N
325	1325	2	3	4	\N	f	\N
326	1325	1	3	3	\N	f	\N
327	1326	9	1	3	\N	f	\N
328	1326	8	1	3	\N	f	\N
329	1326	7	2	3	\N	f	\N
330	1326	5	2	3	\N	f	\N
331	1326	4	2	3	\N	f	\N
332	1326	3	3	3	\N	f	\N
334	1326	2	3	3	\N	f	\N
335	1326	1	3	3	\N	f	\N
336	1327	9	1	3	\N	f	\N
337	1327	8	1	2	\N	f	\N
338	1327	7	1	2	\N	f	\N
339	1327	6	1	2	\N	f	\N
340	1327	5	2	3	\N	f	\N
341	1327	4	2	3	\N	f	\N
342	1327	3	2	3	\N	f	\N
344	1327	2	2	3	\N	f	\N
345	1327	1	2	4	\N	f	\N
346	1328	9	4	4	\N	f	\N
347	1328	8	4	4	\N	f	\N
348	1328	7	4	4	\N	f	\N
349	1328	6	4	4	\N	f	\N
350	1328	4	2	3	\N	f	\N
351	1328	3	4	4	\N	f	\N
354	1328	2	2	3	\N	f	\N
355	1328	1	2	3	\N	f	\N
356	1329	9	4	4	\N	f	\N
357	1329	8	4	4	\N	f	\N
358	1329	7	4	4	\N	f	\N
359	1329	6	4	4	\N	f	\N
360	1329	5	4	4	\N	f	\N
361	1329	4	4	4	\N	f	\N
362	1329	3	4	4	\N	f	\N
364	1329	2	4	4	\N	f	\N
365	1329	1	4	4	\N	f	\N
366	1330	8	2	3	\N	f	\N
367	1330	4	3	3	\N	f	\N
368	1330	3	4	4	\N	f	\N
370	1330	2	3	2	\N	f	\N
371	1330	1	3	2	\N	f	\N
372	1331	9	3	3	\N	f	\N
373	1331	8	3	2	\N	f	\N
374	1331	7	4	4	\N	f	\N
375	1331	5	4	4	\N	f	\N
376	1331	4	4	4	\N	f	\N
377	1331	3	4	4	\N	f	\N
379	1331	2	3	4	\N	f	\N
380	1331	1	3	4	\N	f	\N
381	1332	9	2	4	\N	f	\N
382	1332	6	3	3	\N	f	\N
383	1332	5	3	4	\N	f	\N
384	1332	4	3	4	\N	f	\N
385	1332	3	3	4	\N	f	\N
388	1332	2	2	4	\N	f	\N
389	1332	1	2	4	\N	f	\N
390	1333	9	4	3	\N	f	\N
391	1333	8	4	4	\N	f	\N
392	1333	7	4	4	\N	f	\N
393	1334	9	3	3	\N	f	\N
394	1334	8	2	3	\N	f	\N
395	1334	7	2	4	\N	f	\N
396	1334	6	2	3	\N	f	\N
397	1334	5	2	2	\N	f	\N
398	1334	4	3	2	\N	f	\N
399	1334	3	3	2	\N	f	\N
401	1334	2	2	3	\N	f	\N
402	1334	1	2	2	\N	f	\N
404	1335	9	3	3	\N	f	\N
405	1335	8	3	2	\N	f	\N
406	1335	7	3	3	\N	f	\N
407	1335	5	4	4	\N	f	\N
408	1335	4	4	4	\N	f	\N
409	1335	3	4	4	\N	f	\N
411	1335	2	4	4	\N	f	\N
412	1335	1	3	4	\N	f	\N
413	1336	9	4	3	\N	f	\N
414	1336	8	4	3	\N	f	\N
415	1336	7	4	4	\N	f	\N
416	1336	6	4	4	\N	f	\N
417	1336	5	4	4	\N	f	\N
418	1336	4	4	3	\N	f	\N
419	1336	3	4	3	\N	f	\N
421	1336	2	4	3	\N	f	\N
422	1336	1	4	3	\N	f	\N
423	1337	9	4	3	\N	f	\N
424	1337	8	4	4	\N	f	\N
425	1337	7	3	4	\N	f	\N
426	1337	6	3	4	\N	f	\N
427	1337	5	3	3	\N	f	\N
428	1337	3	3	4	\N	f	\N
430	1337	2	3	4	\N	f	\N
431	1337	1	3	3	\N	f	\N
432	1338	9	3	3	\N	f	\N
433	1338	8	3	3	\N	f	\N
434	1338	7	3	2	\N	f	\N
435	1338	6	3	3	\N	f	\N
436	1338	5	3	3	\N	f	\N
437	1338	4	3	4	\N	f	\N
438	1338	3	3	4	\N	f	\N
440	1338	2	3	4	\N	f	\N
441	1338	1	3	4	\N	f	\N
442	1339	9	2	3	\N	f	\N
443	1339	8	2	3	\N	f	\N
444	1339	7	1	3	\N	f	\N
445	1339	6	1	3	\N	f	\N
446	1339	5	2	3	\N	f	\N
447	1339	4	2	3	\N	f	\N
449	1339	2	2	3	\N	f	\N
450	1339	1	2	3	\N	f	\N
451	1340	9	3	4	\N	f	\N
452	1340	8	3	4	\N	f	\N
453	1340	7	2	4	\N	f	\N
454	1340	6	2	4	\N	f	\N
455	1340	5	2	4	\N	f	\N
456	1340	4	2	4	\N	f	\N
457	1340	3	2	4	\N	f	\N
459	1340	2	2	3	\N	f	\N
460	1340	1	2	3	\N	f	\N
461	1341	9	3	4	\N	f	\N
462	1341	8	3	4	\N	f	\N
463	1341	7	3	4	\N	f	\N
464	1341	6	3	4	\N	f	\N
465	1341	5	3	4	\N	f	\N
466	1341	3	4	3	\N	f	\N
468	1341	2	4	3	\N	f	\N
469	1341	1	4	4	\N	f	\N
470	1342	9	3	3	\N	f	\N
471	1342	8	3	3	\N	f	\N
472	1342	6	2	3	\N	f	\N
473	1342	5	2	2	\N	f	\N
475	1342	4	4	3	\N	f	\N
476	1342	3	3	2	\N	f	\N
478	1342	2	3	3	\N	f	\N
479	1342	1	3	3	\N	f	\N
480	1343	9	2	3	\N	f	\N
481	1343	8	2	3	\N	f	\N
482	1343	7	2	3	\N	f	\N
484	1343	6	3	3	\N	f	\N
485	1343	5	2	2	\N	f	\N
486	1343	4	3	2	\N	f	\N
487	1343	3	3	2	\N	f	\N
489	1343	2	2	3	\N	f	\N
490	1344	9	3	3	\N	f	\N
491	1344	8	4	3	\N	f	\N
492	1344	5	3	4	\N	f	\N
493	1344	4	3	4	\N	f	\N
494	1344	3	3	4	\N	f	\N
496	1344	2	2	3	\N	f	\N
497	1344	1	2	3	\N	f	\N
498	1345	9	2	4	\N	f	\N
499	1345	8	3	3	\N	f	\N
500	1345	7	3	2	\N	f	\N
501	1345	6	3	4	\N	f	\N
502	1345	5	2	3	\N	f	\N
503	1345	4	2	3	\N	f	\N
504	1345	3	2	3	\N	f	\N
505	1345	2	2	3	\N	f	\N
506	1345	1	2	3	\N	f	\N
507	1346	9	3	3	\N	f	\N
508	1346	8	3	3	\N	f	\N
509	1346	7	3	3	\N	f	\N
510	1346	5	4	2	\N	f	\N
511	1346	4	3	3	\N	f	\N
512	1346	3	4	3	\N	f	\N
513	1347	9	3	2	\N	f	\N
514	1347	8	3	2	\N	f	\N
515	1347	7	3	3	\N	f	\N
516	1347	5	3	3	\N	f	\N
517	1347	4	3	3	\N	f	\N
518	1347	3	3	3	\N	f	\N
520	1347	2	2	3	\N	f	\N
521	1347	1	2	3	\N	f	\N
522	1348	9	1	3	\N	f	\N
523	1348	8	1	3	\N	f	\N
524	1348	7	2	3	\N	f	\N
525	1348	6	2	3	\N	f	\N
526	1348	5	3	3	\N	f	\N
527	1348	4	1	3	\N	f	\N
528	1348	3	1	3	\N	f	\N
530	1348	2	2	3	\N	f	\N
531	1348	1	2	3	\N	f	\N
532	1349	9	2	4	\N	f	\N
533	1349	8	2	4	\N	f	\N
534	1349	7	2	3	\N	f	\N
535	1349	6	2	2	\N	f	\N
536	1349	5	2	3	\N	f	\N
537	1349	4	2	3	\N	f	\N
538	1349	3	4	3	\N	f	\N
539	1350	8	3	2	\N	f	\N
540	1350	3	4	3	\N	f	\N
542	1350	2	4	4	\N	f	\N
543	1350	1	4	4	\N	f	\N
544	1351	9	1	3	\N	f	\N
545	1351	5	2	4	\N	f	\N
546	1351	3	2	4	\N	f	\N
548	1351	2	3	4	\N	f	\N
549	1351	1	2	4	\N	f	\N
550	1352	9	2	4	\N	f	\N
551	1352	8	2	4	\N	f	\N
552	1352	7	2	3	\N	f	\N
553	1352	5	3	3	\N	f	\N
554	1352	4	3	3	\N	f	\N
555	1353	9	3	4	\N	f	\N
556	1353	8	3	4	\N	f	\N
557	1353	7	3	4	\N	f	\N
558	1353	6	3	4	\N	f	\N
559	1353	5	4	3	\N	f	\N
560	1353	3	3	3	\N	f	\N
561	1354	9	3	4	\N	f	\N
562	1354	8	3	3	\N	f	\N
564	1354	6	4	3	\N	f	\N
565	1354	5	4	2	\N	f	\N
566	1354	4	3	4	\N	f	\N
567	1354	3	3	3	\N	f	\N
569	1354	2	3	4	\N	f	\N
570	1354	1	3	4	\N	f	\N
571	1355	9	4	4	\N	f	\N
572	1355	8	4	4	\N	f	\N
573	1355	7	4	4	\N	f	\N
574	1355	6	4	4	\N	f	\N
575	1355	5	4	4	\N	f	\N
576	1355	3	4	4	\N	f	\N
578	1355	2	4	4	\N	f	\N
579	1356	9	4	4	\N	f	\N
580	1356	8	4	4	\N	f	\N
581	1356	7	4	4	\N	f	\N
582	1356	5	4	4	\N	f	\N
584	1356	3	4	4	\N	f	\N
586	1356	2	4	3	\N	f	\N
587	1356	1	4	3	\N	f	\N
588	1357	9	1	3	\N	f	\N
589	1357	8	2	4	\N	f	\N
590	1357	7	2	3	\N	f	\N
591	1357	6	2	4	\N	f	\N
592	1357	5	3	4	\N	f	\N
593	1357	4	3	4	\N	f	\N
594	1357	3	2	4	\N	f	\N
595	1357	2	2	4	\N	f	\N
596	1357	1	3	4	\N	f	\N
597	1358	9	1	4	\N	f	\N
598	1358	8	2	4	\N	f	\N
599	1358	7	2	4	\N	f	\N
600	1358	6	2	3	\N	f	\N
601	1358	5	2	3	\N	f	\N
602	1358	4	2	3	\N	f	\N
603	1358	3	4	4	\N	f	\N
605	1358	2	4	4	\N	f	\N
606	1358	1	2	4	\N	f	\N
607	1359	9	4	4	\N	f	\N
608	1359	8	4	4	\N	f	\N
609	1359	7	4	3	\N	f	\N
610	1359	6	4	4	\N	f	\N
611	1359	5	4	4	\N	f	\N
612	1359	4	4	4	\N	f	\N
613	1359	3	3	4	\N	f	\N
615	1359	2	4	4	\N	f	\N
616	1359	1	4	4	\N	f	\N
617	1360	9	4	4	\N	f	\N
618	1360	8	4	3	\N	f	\N
619	1360	6	3	3	\N	f	\N
620	1360	5	3	3	\N	f	\N
622	1360	2	3	3	\N	f	\N
623	1361	9	4	4	\N	f	\N
624	1361	8	4	3	\N	f	\N
625	1361	7	4	3	\N	f	\N
626	1361	5	4	4	\N	f	\N
627	1361	3	4	3	\N	f	\N
629	1361	2	4	3	\N	f	\N
631	1361	1	4	3	\N	f	\N
632	1362	9	4	3	\N	f	\N
633	1362	8	4	3	\N	f	\N
634	1362	7	4	3	\N	f	\N
635	1362	6	3	3	\N	f	\N
636	1362	5	3	3	\N	f	\N
637	1362	3	3	4	\N	f	\N
640	1362	2	3	3	\N	f	\N
641	1362	1	3	3	\N	f	\N
642	1363	9	2	3	\N	f	\N
643	1363	8	2	3	\N	f	\N
644	1363	7	2	3	\N	f	\N
645	1363	6	4	3	\N	f	\N
646	1363	5	3	3	\N	f	\N
647	1363	4	3	3	\N	f	\N
648	1363	3	3	3	\N	f	\N
652	1363	2	2	3	\N	f	\N
653	1363	1	3	2	\N	f	\N
655	1364	8	3	4	\N	f	\N
656	1364	4	2	3	\N	f	\N
657	1364	3	3	3	\N	f	\N
660	1364	2	3	3	\N	f	\N
661	1364	1	3	3	\N	f	\N
662	1365	9	4	4	\N	f	\N
663	1365	8	4	4	\N	f	\N
664	1365	7	4	4	\N	f	\N
665	1365	5	3	3	\N	f	\N
666	1365	3	3	4	\N	f	\N
668	1365	2	3	4	\N	f	\N
669	1365	1	3	4	\N	f	\N
670	1366	9	4	4	\N	f	\N
671	1366	8	4	4	\N	f	\N
672	1366	7	4	4	\N	f	\N
673	1366	6	4	4	\N	f	\N
674	1366	5	4	4	\N	f	\N
675	1366	3	4	3	\N	f	\N
677	1366	2	4	3	\N	f	\N
678	1366	1	4	3	\N	f	\N
679	1367	9	2	4	\N	f	\N
680	1367	8	2	4	\N	f	\N
681	1367	7	1	3	\N	f	\N
682	1367	6	2	3	\N	f	\N
683	1367	5	3	3	\N	f	\N
684	1367	4	3	3	\N	f	\N
685	1367	3	2	3	\N	f	\N
687	1367	2	1	4	\N	f	\N
688	1367	1	1	4	\N	f	\N
689	1368	9	3	4	\N	f	\N
690	1368	8	3	3	\N	f	\N
691	1368	7	2	3	\N	f	\N
692	1368	6	4	3	\N	f	\N
693	1368	5	4	4	\N	f	\N
694	1368	4	4	4	\N	f	\N
695	1368	3	4	4	\N	f	\N
697	1368	2	3	4	\N	f	\N
698	1368	1	3	4	\N	f	\N
699	1369	9	3	3	\N	f	\N
700	1369	8	3	3	\N	f	\N
701	1369	7	3	3	\N	f	\N
702	1369	6	3	3	\N	f	\N
703	1369	5	3	3	\N	f	\N
704	1369	3	4	4	\N	f	\N
706	1369	2	4	4	\N	f	\N
707	1369	1	4	4	\N	f	\N
708	1370	9	2	3	\N	f	\N
709	1370	8	2	3	\N	f	\N
710	1370	7	3	2	\N	f	\N
711	1370	6	2	3	\N	f	\N
712	1370	5	3	3	\N	f	\N
713	1370	4	3	3	\N	f	\N
714	1370	3	3	3	\N	f	\N
716	1370	2	3	3	\N	f	\N
717	1370	1	3	3	\N	f	\N
718	1371	9	4	4	\N	f	\N
719	1371	4	4	3	\N	f	\N
720	1371	3	4	3	\N	f	\N
722	1371	2	4	4	\N	f	\N
723	1371	1	4	4	\N	f	\N
724	1372	9	4	4	\N	f	\N
725	1372	8	4	4	\N	f	\N
726	1372	7	4	4	\N	f	\N
727	1372	6	4	4	\N	f	\N
728	1372	5	4	3	\N	f	\N
729	1372	4	4	3	\N	f	\N
730	1372	3	4	3	\N	f	\N
733	1372	2	3	3	\N	f	\N
734	1372	1	3	3	\N	f	\N
735	1373	8	1	2	\N	f	\N
736	1373	7	1	2	\N	f	\N
737	1373	5	2	3	\N	f	\N
738	1373	4	2	3	\N	f	\N
739	1373	3	2	3	\N	f	\N
740	1373	2	3	2	\N	f	\N
741	1373	1	1	3	\N	f	\N
742	1374	9	2	3	\N	f	\N
743	1374	8	2	3	\N	f	\N
744	1374	7	1	3	\N	f	\N
745	1374	4	4	3	\N	f	\N
746	1374	3	4	3	\N	f	\N
748	1374	2	3	3	\N	f	\N
749	1374	1	2	3	\N	f	\N
750	1375	9	4	3	\N	f	\N
751	1375	8	3	4	\N	f	\N
752	1375	7	3	3	\N	f	\N
753	1375	6	3	4	\N	f	\N
754	1375	5	3	4	\N	f	\N
755	1375	4	3	4	\N	f	\N
756	1375	3	3	4	\N	f	\N
758	1375	2	3	3	\N	f	\N
759	1375	1	3	3	\N	f	\N
760	1376	9	2	3	\N	f	\N
761	1376	8	2	2	\N	f	\N
762	1376	7	2	3	\N	f	\N
763	1376	5	3	4	\N	f	\N
764	1376	4	3	4	\N	f	\N
765	1376	3	2	3	\N	f	\N
767	1376	2	2	4	\N	f	\N
768	1376	1	2	3	\N	f	\N
769	1377	9	3	4	\N	f	\N
770	1377	8	3	3	\N	f	\N
771	1377	7	3	3	\N	f	\N
772	1377	6	3	3	\N	f	\N
773	1377	5	3	4	\N	f	\N
774	1377	4	3	4	\N	f	\N
775	1377	3	3	4	\N	f	\N
777	1377	2	2	4	\N	f	\N
778	1377	1	2	4	\N	f	\N
779	1378	9	3	4	\N	f	\N
780	1378	8	2	4	\N	f	\N
781	1378	7	2	3	\N	f	\N
782	1378	6	1	3	\N	f	\N
783	1378	5	1	3	\N	f	\N
784	1378	4	3	2	\N	f	\N
785	1378	3	2	2	\N	f	\N
787	1378	2	2	3	\N	f	\N
788	1378	1	2	3	\N	f	\N
789	1379	9	3	4	\N	f	\N
790	1379	8	3	4	\N	f	\N
791	1379	7	3	3	\N	f	\N
792	1379	6	3	3	\N	f	\N
793	1379	5	4	3	\N	f	\N
794	1379	4	4	3	\N	f	\N
795	1379	3	4	4	\N	f	\N
797	1379	2	4	4	\N	f	\N
798	1379	1	4	4	\N	f	\N
799	1380	9	3	3	\N	f	\N
800	1380	8	3	3	\N	f	\N
801	1380	7	3	3	\N	f	\N
802	1380	6	3	3	\N	f	\N
803	1380	5	3	4	\N	f	\N
804	1380	4	3	4	\N	f	\N
805	1380	3	4	4	\N	f	\N
807	1380	2	3	4	\N	f	\N
808	1380	1	3	4	\N	f	\N
809	1381	9	2	4	\N	f	\N
810	1381	8	2	3	\N	f	\N
811	1381	7	2	3	\N	f	\N
812	1381	6	4	4	\N	f	\N
813	1381	5	3	3	\N	f	\N
814	1381	4	3	3	\N	f	\N
815	1381	3	2	3	\N	f	\N
817	1381	2	3	2	\N	f	\N
818	1382	9	3	3	\N	f	\N
819	1382	8	4	3	\N	f	\N
820	1382	7	4	4	\N	f	\N
821	1382	6	4	4	\N	f	\N
822	1382	5	3	4	\N	f	\N
823	1382	4	3	4	\N	f	\N
824	1382	3	3	4	\N	f	\N
826	1382	2	3	4	\N	f	\N
827	1382	1	3	4	\N	f	\N
828	1383	9	3	4	\N	f	\N
829	1383	8	3	4	\N	f	\N
830	1383	7	3	4	\N	f	\N
831	1383	4	3	4	\N	f	\N
832	1384	9	3	4	\N	f	\N
833	1384	8	3	4	\N	f	\N
834	1384	7	2	4	\N	f	\N
835	1384	6	3	3	\N	f	\N
836	1384	5	2	3	\N	f	\N
837	1384	3	2	3	\N	f	\N
840	1384	2	2	3	\N	f	\N
841	1384	1	2	3	\N	f	\N
842	1385	9	4	4	\N	f	\N
843	1385	8	4	4	\N	f	\N
844	1385	7	4	4	\N	f	\N
845	1385	6	3	3	\N	f	\N
846	1385	5	3	4	\N	f	\N
847	1385	4	3	4	\N	f	\N
848	1385	3	3	3	\N	f	\N
850	1385	2	3	3	\N	f	\N
851	1385	1	3	3	\N	f	\N
852	1386	9	4	2	\N	f	\N
853	1386	8	1	3	\N	f	\N
854	1386	6	3	3	\N	f	\N
855	1386	5	3	3	\N	f	\N
856	1386	4	3	3	\N	f	\N
857	1386	3	3	4	\N	f	\N
858	1387	9	2	4	\N	f	\N
859	1387	8	3	3	\N	f	\N
860	1387	7	2	3	\N	f	\N
861	1387	6	3	3	\N	f	\N
862	1387	5	3	3	\N	f	\N
863	1387	4	3	3	\N	f	\N
864	1387	3	3	3	\N	f	\N
866	1387	2	3	3	\N	f	\N
867	1387	1	3	4	\N	f	\N
868	1388	9	3	3	\N	f	\N
869	1388	8	3	3	\N	f	\N
870	1388	7	3	3	\N	f	\N
871	1388	5	2	3	\N	f	\N
872	1388	4	3	3	\N	f	\N
873	1388	3	3	3	\N	f	\N
875	1388	2	4	4	\N	f	\N
876	1388	1	4	4	\N	f	\N
877	1389	9	4	4	\N	f	\N
878	1389	8	2	3	\N	f	\N
879	1389	6	4	3	\N	f	\N
880	1389	4	4	3	\N	f	\N
881	1389	3	3	4	\N	f	\N
882	1390	9	3	3	\N	f	\N
883	1390	8	3	3	\N	f	\N
884	1390	7	3	3	\N	f	\N
885	1390	6	3	3	\N	f	\N
886	1390	5	3	4	\N	f	\N
887	1390	4	4	4	\N	f	\N
888	1390	3	4	4	\N	f	\N
890	1390	2	4	4	\N	f	\N
891	1390	1	4	4	\N	f	\N
892	1391	9	3	3	\N	f	\N
893	1391	8	3	3	\N	f	\N
894	1391	6	4	4	\N	f	\N
895	1391	4	3	4	\N	f	\N
896	1391	3	3	4	\N	f	\N
898	1391	2	3	4	\N	f	\N
899	1392	9	2	2	\N	f	\N
900	1392	8	2	4	\N	f	\N
901	1392	7	2	4	\N	f	\N
902	1392	6	3	4	\N	f	\N
903	1392	5	3	3	\N	f	\N
904	1392	4	3	3	\N	f	\N
905	1392	3	2	4	\N	f	\N
906	1392	2	2	2	\N	f	\N
907	1392	1	2	3	\N	f	\N
908	1393	9	4	3	\N	f	\N
910	1393	8	4	3	\N	f	\N
911	1393	5	3	2	\N	f	\N
912	1393	4	3	3	\N	f	\N
913	1393	3	4	3	\N	f	\N
915	1393	2	4	3	\N	f	\N
916	1393	1	4	4	\N	f	\N
917	1394	9	4	4	\N	f	\N
918	1394	8	4	4	\N	f	\N
919	1394	7	3	4	\N	f	\N
920	1394	6	3	4	\N	f	\N
921	1394	5	3	4	\N	f	\N
922	1394	4	3	4	\N	f	\N
923	1394	3	3	4	\N	f	\N
925	1394	2	4	4	\N	f	\N
926	1394	1	4	4	\N	f	\N
927	1395	9	2	3	\N	f	\N
928	1395	8	2	3	\N	f	\N
929	1395	7	3	3	\N	f	\N
930	1395	6	2	3	\N	f	\N
931	1395	5	2	2	\N	f	\N
932	1395	4	2	1	\N	f	\N
933	1395	3	2	2	\N	f	\N
935	1396	9	4	4	\N	f	\N
936	1396	8	4	4	\N	f	\N
937	1396	7	4	4	\N	f	\N
938	1396	5	4	4	\N	f	\N
939	1396	4	4	4	\N	f	\N
940	1396	3	4	4	\N	f	\N
942	1396	2	4	3	\N	f	\N
943	1396	1	4	3	\N	f	\N
944	1397	9	4	3	\N	f	\N
945	1397	8	4	3	\N	f	\N
946	1397	7	4	3	\N	f	\N
947	1397	5	1	4	\N	f	\N
948	1397	4	3	3	\N	f	\N
949	1397	3	4	4	\N	f	\N
951	1397	2	4	4	\N	f	\N
952	1398	9	3	3	\N	f	\N
953	1398	8	3	3	\N	f	\N
954	1398	7	2	4	\N	f	\N
955	1398	6	3	2	\N	f	\N
956	1398	5	3	4	\N	f	\N
957	1398	4	3	3	\N	f	\N
958	1398	3	4	4	\N	f	\N
960	1398	2	4	3	\N	f	\N
961	1398	1	4	3	\N	f	\N
962	1399	9	4	4	\N	f	\N
963	1399	8	4	4	\N	f	\N
964	1399	7	3	4	\N	f	\N
965	1399	5	3	4	\N	f	\N
966	1399	4	3	3	\N	f	\N
967	1400	9	4	4	\N	f	\N
968	1400	7	4	4	\N	f	\N
969	1400	5	4	4	\N	f	\N
970	1400	4	4	4	\N	f	\N
971	1400	3	4	4	\N	f	\N
974	1400	2	4	4	\N	f	\N
976	1400	1	4	4	\N	f	\N
977	1401	9	4	4	\N	f	\N
978	1401	8	4	4	\N	f	\N
979	1401	7	4	4	\N	f	\N
980	1401	6	4	4	\N	f	\N
981	1401	5	4	4	\N	f	\N
982	1401	3	4	4	\N	f	\N
984	1401	2	4	4	\N	f	\N
985	1402	9	1	3	\N	f	\N
986	1402	8	1	3	\N	f	\N
987	1402	7	2	3	\N	f	\N
988	1402	6	2	3	\N	f	\N
989	1402	5	3	3	\N	f	\N
990	1402	4	3	3	\N	f	\N
991	1402	3	3	4	\N	f	\N
993	1402	2	1	3	\N	f	\N
994	1402	1	1	3	\N	f	\N
995	1403	9	2	3	\N	f	\N
996	1403	5	2	4	\N	f	\N
997	1404	9	2	4	\N	f	\N
998	1404	8	2	3	\N	f	\N
999	1404	7	2	3	\N	f	\N
1000	1404	6	1	3	\N	f	\N
1001	1404	5	2	2	\N	f	\N
1002	1404	4	2	2	\N	f	\N
1003	1404	3	3	2	\N	f	\N
1005	1404	2	3	4	\N	f	\N
1006	1404	1	3	3	\N	f	\N
1007	1405	9	3	3	\N	f	\N
1008	1405	8	2	3	\N	f	\N
1009	1405	7	3	4	\N	f	\N
1010	1405	5	3	4	\N	f	\N
1011	1405	4	3	4	\N	f	\N
1012	1405	3	3	4	\N	f	\N
1014	1405	2	3	4	\N	f	\N
1015	1405	1	3	4	\N	f	\N
1016	1406	9	4	4	\N	f	\N
1017	1406	8	4	4	\N	f	\N
1018	1406	7	4	3	\N	f	\N
1019	1406	6	4	3	\N	f	\N
1020	1406	5	3	3	\N	f	\N
1021	1406	3	3	4	\N	f	\N
1023	1406	2	3	3	\N	f	\N
1024	1406	1	3	3	\N	f	\N
1025	1407	9	2	4	\N	f	\N
1026	1407	8	2	4	\N	f	\N
1027	1407	6	2	4	\N	f	\N
1028	1407	5	3	4	\N	f	\N
1029	1407	4	4	3	\N	f	\N
1030	1407	3	2	3	\N	f	\N
1032	1407	2	2	3	\N	f	\N
1033	1407	1	2	3	\N	f	\N
1034	1408	9	3	4	\N	f	\N
1035	1408	8	3	4	\N	f	\N
1036	1408	7	4	3	\N	f	\N
1037	1408	6	3	4	\N	f	\N
1038	1408	5	3	3	\N	f	\N
1039	1408	3	2	3	\N	f	\N
1041	1408	2	3	3	\N	f	\N
1042	1408	1	2	3	\N	f	\N
1044	1409	9	3	3	\N	f	\N
1045	1409	8	3	2	\N	f	\N
1046	1409	7	3	3	\N	f	\N
1047	1409	6	3	3	\N	f	\N
1048	1409	5	3	3	\N	f	\N
1049	1409	3	3	3	\N	f	\N
1051	1409	2	3	3	\N	f	\N
1052	1409	1	4	4	\N	f	\N
1053	1410	9	3	4	\N	f	\N
1054	1410	8	3	4	\N	f	\N
1055	1410	7	3	4	\N	f	\N
1056	1410	6	3	4	\N	f	\N
1057	1410	5	3	2	\N	f	\N
1058	1410	3	2	3	\N	f	\N
1060	1410	2	4	3	\N	f	\N
1061	1410	1	4	3	\N	f	\N
1062	1411	8	2	3	\N	f	\N
1063	1411	7	2	3	\N	f	\N
1064	1411	6	1	3	\N	f	\N
1065	1411	5	1	2	\N	f	\N
1066	1411	4	3	2	\N	f	\N
1067	1411	3	4	3	\N	f	\N
1068	1411	2	3	3	\N	f	\N
1069	1411	1	3	3	\N	f	\N
1070	1412	9	3	4	\N	f	\N
1071	1412	8	3	4	\N	f	\N
1072	1412	7	3	4	\N	f	\N
1073	1412	6	3	4	\N	f	\N
1074	1412	4	3	4	\N	f	\N
1075	1412	3	4	4	\N	f	\N
1077	1412	2	3	4	\N	f	\N
1078	1412	1	3	4	\N	f	\N
1079	1413	9	3	3	\N	f	\N
1080	1413	8	3	3	\N	f	\N
1081	1413	7	2	3	\N	f	\N
1082	1413	6	2	3	\N	f	\N
1083	1413	5	2	1	\N	f	\N
1084	1413	4	2	2	\N	f	\N
1085	1413	3	2	3	\N	f	\N
1087	1413	2	1	3	\N	f	\N
1088	1413	1	1	3	\N	f	\N
1089	1414	9	4	4	\N	f	\N
1090	1414	8	3	4	\N	f	\N
1091	1414	7	3	4	\N	f	\N
1092	1414	6	3	4	\N	f	\N
1093	1414	5	3	4	\N	f	\N
1094	1414	4	3	4	\N	f	\N
1095	1414	3	3	4	\N	f	\N
1097	1414	2	3	4	\N	f	\N
1098	1414	1	3	3	\N	f	\N
1099	1415	9	2	3	\N	f	\N
1100	1415	8	2	3	\N	f	\N
1101	1415	7	2	3	\N	f	\N
1102	1415	6	3	3	\N	f	\N
1103	1415	5	3	3	\N	f	\N
1104	1415	4	3	3	\N	f	\N
1105	1415	3	3	3	\N	f	\N
1107	1415	2	2	4	\N	f	\N
1108	1415	1	2	3	\N	f	\N
1109	1416	9	2	3	\N	f	\N
1111	1416	8	2	3	\N	f	\N
1112	1416	7	4	1	\N	f	\N
1113	1416	5	4	4	\N	f	\N
1114	1416	4	4	4	\N	f	\N
1115	1416	3	4	4	\N	f	\N
1117	1416	2	4	4	\N	f	\N
1118	1416	1	4	4	\N	f	\N
1119	1417	9	4	4	\N	f	\N
1120	1417	8	4	4	\N	f	\N
1121	1417	6	4	4	\N	f	\N
1122	1417	5	3	3	\N	f	\N
1123	1417	4	4	4	\N	f	\N
1124	1417	3	4	4	\N	f	\N
1126	1417	2	3	4	\N	f	\N
1127	1417	1	4	3	\N	f	\N
1128	1418	9	2	3	\N	f	\N
1129	1418	8	3	3	\N	f	\N
1130	1418	7	2	4	\N	f	\N
1131	1418	6	3	4	\N	f	\N
1132	1418	5	3	3	\N	f	\N
1133	1418	4	2	3	\N	f	\N
1134	1418	3	2	3	\N	f	\N
1136	1418	2	2	4	\N	f	\N
1137	1418	1	2	4	\N	f	\N
1138	1419	9	3	3	\N	f	\N
1139	1419	8	3	3	\N	f	\N
1140	1419	7	3	4	\N	f	\N
1141	1419	4	4	4	\N	f	\N
1142	1420	6	4	4	\N	f	\N
1143	1420	4	4	4	\N	f	\N
1144	1420	3	4	3	\N	f	\N
1146	1420	2	4	3	\N	f	\N
1147	1420	1	4	3	\N	f	\N
1148	1421	9	4	4	\N	f	\N
1149	1421	7	4	4	\N	f	\N
1150	1421	6	4	4	\N	f	\N
1151	1421	5	4	4	\N	f	\N
1152	1421	4	4	4	\N	f	\N
1153	1421	3	4	4	\N	f	\N
1155	1421	2	4	4	\N	f	\N
1156	1421	1	4	4	\N	f	\N
1157	1422	9	2	4	\N	f	\N
1158	1422	8	2	4	\N	f	\N
1159	1422	7	3	3	\N	f	\N
1160	1422	6	3	3	\N	f	\N
1161	1422	5	3	4	\N	f	\N
1162	1422	4	3	4	\N	f	\N
1163	1422	3	3	4	\N	f	\N
1165	1422	2	4	4	\N	f	\N
1166	1422	1	4	4	\N	f	\N
1167	1423	9	3	4	\N	f	\N
1168	1423	8	3	4	\N	f	\N
1169	1423	7	3	4	\N	f	\N
1170	1423	5	4	4	\N	f	\N
1171	1423	4	4	4	\N	f	\N
1172	1423	1	4	4	\N	f	\N
1173	1424	9	1	3	\N	f	\N
1174	1424	8	1	2	\N	f	\N
1175	1424	6	3	3	\N	f	\N
1176	1424	5	3	3	\N	f	\N
1177	1424	4	3	3	\N	f	\N
1178	1424	3	3	2	\N	f	\N
1179	1424	2	3	3	\N	f	\N
1180	1424	1	4	3	\N	f	\N
1181	1425	9	4	3	\N	f	\N
1182	1425	8	4	3	\N	f	\N
1183	1425	7	3	3	\N	f	\N
1184	1425	6	3	3	\N	f	\N
1185	1425	5	4	4	\N	f	\N
1186	1425	4	4	4	\N	f	\N
1187	1425	3	4	4	\N	f	\N
1189	1425	2	3	4	\N	f	\N
1190	1425	1	3	4	\N	f	\N
1191	1426	9	3	4	\N	f	\N
1192	1426	4	4	4	\N	f	\N
1193	1426	3	3	4	\N	f	\N
1195	1426	2	3	4	\N	f	\N
1196	1427	9	3	4	\N	f	\N
1197	1427	8	3	4	\N	f	\N
1198	1427	7	3	4	\N	f	\N
1199	1427	6	4	4	\N	f	\N
1200	1427	5	3	4	\N	f	\N
1202	1427	4	4	4	\N	f	\N
1203	1427	3	4	4	\N	f	\N
1204	1427	2	3	4	\N	f	\N
1205	1427	1	3	3	\N	f	\N
1206	1428	9	4	4	\N	f	\N
1207	1429	9	2	4	\N	f	\N
1208	1429	8	1	3	\N	f	\N
1209	1429	6	2	3	\N	f	\N
1210	1429	5	3	3	\N	f	\N
1211	1429	3	2	4	\N	f	\N
1212	1430	9	4	4	\N	f	\N
1213	1430	8	3	4	\N	f	\N
1214	1430	7	3	4	\N	f	\N
1215	1430	6	3	4	\N	f	\N
1216	1430	5	4	4	\N	f	\N
1217	1430	3	3	4	\N	f	\N
1219	1430	2	4	3	\N	f	\N
1220	1430	1	4	3	\N	f	\N
1221	1431	9	3	3	\N	f	\N
1222	1431	8	3	3	\N	f	\N
1223	1431	7	1	2	\N	f	\N
1224	1431	6	1	3	\N	f	\N
1225	1431	5	1	2	\N	f	\N
1226	1431	4	2	3	\N	f	\N
1227	1431	3	2	3	\N	f	\N
1229	1431	2	3	2	\N	f	\N
1230	1431	1	3	2	\N	f	\N
1231	1432	9	2	4	\N	f	\N
1232	1432	8	2	4	\N	f	\N
1233	1432	7	2	4	\N	f	\N
1234	1432	5	3	4	\N	f	\N
1235	1432	4	3	4	\N	f	\N
1236	1432	3	2	4	\N	f	\N
1238	1432	2	2	4	\N	f	\N
1239	1432	1	2	4	\N	f	\N
1240	1433	9	3	4	\N	f	\N
1241	1433	8	2	4	\N	f	\N
1242	1433	6	2	3	\N	f	\N
1243	1433	5	2	3	\N	f	\N
1244	1433	4	2	2	\N	f	\N
1245	1433	3	1	3	\N	f	\N
1246	1434	9	2	3	\N	f	\N
1247	1434	8	2	3	\N	f	\N
1248	1434	6	4	3	\N	f	\N
1249	1434	5	3	2	\N	f	\N
1250	1434	4	3	4	\N	f	\N
1251	1434	3	2	4	\N	f	\N
1252	1435	9	2	3	\N	f	\N
1253	1435	8	3	3	\N	f	\N
1254	1435	7	2	3	\N	f	\N
1255	1435	5	3	4	\N	f	\N
1256	1435	4	3	4	\N	f	\N
1257	1435	3	4	4	\N	f	\N
1258	1436	9	3	3	\N	f	\N
1259	1436	8	3	3	\N	f	\N
1260	1436	7	3	2	\N	f	\N
1261	1436	5	3	3	\N	f	\N
1262	1436	4	3	3	\N	f	\N
1263	1437	9	3	3	\N	f	\N
1264	1437	8	3	4	\N	f	\N
1265	1437	7	3	4	\N	f	\N
1266	1437	6	3	3	\N	f	\N
1267	1437	5	3	3	\N	f	\N
1268	1437	4	4	3	\N	f	\N
1269	1437	3	3	4	\N	f	\N
1271	1437	2	3	4	\N	f	\N
1272	1437	1	3	4	\N	f	\N
1273	1438	9	3	4	\N	f	\N
1274	1438	8	3	4	\N	f	\N
1275	1438	7	3	4	\N	f	\N
1276	1438	6	3	4	\N	f	\N
1277	1438	5	4	3	\N	f	\N
1278	1438	4	4	3	\N	f	\N
1279	1438	3	3	3	\N	f	\N
1282	1438	2	3	4	\N	f	\N
1283	1438	1	3	4	\N	f	\N
1284	1439	9	3	3	\N	f	\N
1285	1439	8	3	3	\N	f	\N
1286	1439	7	3	3	\N	f	\N
1287	1439	5	3	3	\N	f	\N
1288	1439	4	4	3	\N	f	\N
1289	1439	3	4	3	\N	f	\N
1292	1439	2	3	3	\N	f	\N
1293	1440	9	2	4	\N	f	\N
1294	1440	8	2	4	\N	f	\N
1295	1440	7	2	4	\N	f	\N
1296	1440	6	2	4	\N	f	\N
1297	1440	5	2	4	\N	f	\N
1298	1440	4	2	4	\N	f	\N
1299	1440	3	2	4	\N	f	\N
1300	1440	2	2	4	\N	f	\N
1301	1440	1	2	4	\N	f	\N
1302	1441	9	3	4	\N	f	\N
1303	1441	8	3	3	\N	f	\N
1304	1441	7	3	3	\N	f	\N
1306	1441	6	3	3	\N	f	\N
1307	1441	5	3	3	\N	f	\N
1308	1441	4	3	3	\N	f	\N
1309	1442	9	4	4	\N	f	\N
1310	1442	8	4	4	\N	f	\N
1311	1442	7	4	4	\N	f	\N
1312	1442	6	4	4	\N	f	\N
1313	1442	5	4	4	\N	f	\N
1314	1442	4	4	4	\N	f	\N
1315	1442	3	4	4	\N	f	\N
1316	1442	2	4	4	\N	f	\N
1317	1442	1	4	4	\N	f	\N
1318	1443	9	3	3	\N	f	\N
1319	1443	8	3	3	\N	f	\N
1320	1443	6	4	3	\N	f	\N
1321	1443	5	4	3	\N	f	\N
1322	1443	3	4	3	\N	f	\N
1324	1444	9	2	2	\N	f	\N
1325	1444	8	3	3	\N	f	\N
1326	1444	7	4	4	\N	f	\N
1327	1444	6	4	4	\N	f	\N
1328	1444	4	3	3	\N	f	\N
1329	1444	3	3	3	\N	f	\N
1331	1444	2	3	3	\N	f	\N
1332	1444	1	3	3	\N	f	\N
1333	1445	9	3	4	\N	f	\N
1334	1445	8	3	3	\N	f	\N
1335	1445	7	3	3	\N	f	\N
1336	1445	6	4	3	\N	f	\N
1337	1445	5	4	3	\N	f	\N
1338	1445	4	4	3	\N	f	\N
1339	1446	9	3	4	\N	f	\N
1340	1446	8	3	4	\N	f	\N
1341	1446	7	3	3	\N	f	\N
1342	1446	5	3	3	\N	f	\N
1343	1446	4	3	3	\N	f	\N
1344	1446	3	3	3	\N	f	\N
1345	1446	2	3	3	\N	f	\N
1346	1446	1	4	2	\N	f	\N
1347	1447	7	3	3	\N	f	\N
1348	1447	6	3	4	\N	f	\N
1349	1447	5	4	3	\N	f	\N
1350	1447	4	4	3	\N	f	\N
1351	1448	9	4	4	\N	f	\N
1352	1448	8	4	4	\N	f	\N
1353	1448	7	4	4	\N	f	\N
1354	1448	5	4	4	\N	f	\N
1355	1448	4	4	4	\N	f	\N
1356	1448	3	4	4	\N	f	\N
1358	1448	2	4	4	\N	f	\N
1359	1448	1	4	4	\N	f	\N
1360	1449	9	2	4	\N	f	\N
1361	1449	8	1	4	\N	f	\N
1362	1449	7	1	4	\N	f	\N
1363	1449	6	1	4	\N	f	\N
1364	1449	5	3	4	\N	f	\N
1365	1449	4	3	3	\N	f	\N
1366	1449	3	3	3	\N	f	\N
1368	1449	2	3	4	\N	f	\N
1369	1449	1	2	4	\N	f	\N
1370	1450	9	2	4	\N	f	\N
1371	1450	8	2	4	\N	f	\N
1372	1450	7	2	4	\N	f	\N
1373	1450	6	2	3	\N	f	\N
1374	1450	5	2	3	\N	f	\N
1375	1450	4	2	2	\N	f	\N
1376	1450	3	3	2	\N	f	\N
1378	1450	2	2	2	\N	f	\N
1379	1450	1	2	3	\N	f	\N
1380	1451	9	3	3	\N	f	\N
1381	1451	8	4	3	\N	f	\N
1382	1451	7	3	4	\N	f	\N
1383	1451	6	3	3	\N	f	\N
1384	1451	5	3	2	\N	f	\N
1385	1451	4	2	3	\N	f	\N
1386	1451	3	4	3	\N	f	\N
1388	1451	2	2	3	\N	f	\N
1389	1451	1	2	3	\N	f	\N
1390	1452	9	4	4	\N	f	\N
1391	1452	8	4	4	\N	f	\N
1392	1452	6	4	4	\N	f	\N
1393	1452	5	4	4	\N	f	\N
1394	1452	4	4	4	\N	f	\N
1395	1452	3	4	4	\N	f	\N
1397	1452	2	4	4	\N	f	\N
1398	1453	9	3	3	\N	f	\N
1399	1453	8	3	3	\N	f	\N
1400	1453	7	3	2	\N	f	\N
1401	1453	6	3	3	\N	f	\N
1402	1453	5	3	3	\N	f	\N
1403	1454	8	3	3	\N	f	\N
1404	1455	9	3	4	\N	f	\N
1405	1455	8	2	3	\N	f	\N
1406	1455	7	2	3	\N	f	\N
1407	1455	6	3	3	\N	f	\N
1408	1455	5	3	2	\N	f	\N
1409	1456	9	3	3	\N	f	\N
1410	1456	8	3	3	\N	f	\N
1411	1456	7	3	3	\N	f	\N
1412	1456	6	3	4	\N	f	\N
1413	1456	5	3	3	\N	f	\N
1414	1457	6	3	3	\N	f	\N
1415	1457	5	3	3	\N	f	\N
1416	1458	9	4	4	\N	f	\N
1417	1458	6	4	4	\N	f	\N
1418	1458	5	4	3	\N	f	\N
1419	1458	4	4	4	\N	f	\N
1420	1459	9	3	3	\N	f	\N
1421	1459	8	3	3	\N	f	\N
1422	1459	6	2	3	\N	f	\N
1423	1459	5	3	3	\N	f	\N
1424	1460	9	3	4	\N	f	\N
1425	1460	8	3	4	\N	f	\N
1426	1460	7	3	4	\N	f	\N
1429	1460	6	3	4	\N	f	\N
1430	1460	5	3	3	\N	f	\N
1431	1461	9	1	3	\N	f	\N
1432	1461	8	1	3	\N	f	\N
1433	1461	7	2	3	\N	f	\N
1434	1461	6	2	3	\N	f	\N
1435	1461	5	3	3	\N	f	\N
1436	1462	9	2	4	\N	f	\N
1437	1462	8	2	4	\N	f	\N
1438	1462	7	2	3	\N	f	\N
1439	1462	6	3	3	\N	f	\N
1440	1463	9	3	3	\N	f	\N
1441	1463	8	2	4	\N	f	\N
1442	1463	7	2	3	\N	f	\N
1443	1463	6	2	3	\N	f	\N
1444	1463	1	3	4	\N	f	\N
1445	1464	9	3	3	\N	f	\N
1446	1464	8	3	3	\N	f	\N
1447	1464	6	3	2	\N	f	\N
1448	1465	9	2	4	\N	f	\N
1449	1465	8	3	3	\N	f	\N
1450	1465	7	3	3	\N	f	\N
1451	1465	6	2	4	\N	f	\N
1452	1466	9	4	3	\N	f	\N
1453	1466	8	4	3	\N	f	\N
1454	1467	9	3	3	\N	f	\N
1455	1467	8	3	3	\N	f	\N
1456	1467	7	3	3	\N	f	\N
1457	1467	6	3	3	\N	f	\N
1458	1468	9	3	4	\N	f	\N
1459	1468	8	3	4	\N	f	\N
1460	1468	7	3	4	\N	f	\N
1461	1469	9	3	3	\N	f	\N
1462	1469	8	4	3	\N	f	\N
1463	1469	7	4	3	\N	f	\N
1464	1470	9	4	3	\N	f	\N
1465	1470	8	4	3	\N	f	\N
1466	1470	7	4	4	\N	f	\N
1467	1470	6	4	4	\N	f	\N
1468	1471	9	2	4	\N	f	\N
1469	1471	8	2	4	\N	f	\N
1470	1471	7	1	3	\N	f	\N
1471	1472	7	4	4	\N	f	\N
1472	1472	6	4	4	\N	f	\N
1473	1473	9	3	3	\N	f	\N
1474	1473	8	3	3	\N	f	\N
1475	1473	7	3	3	\N	f	\N
1476	1474	9	3	4	\N	f	\N
1477	1474	8	4	3	\N	f	\N
1478	1474	6	4	3	\N	f	\N
1479	1475	9	3	3	\N	f	\N
1480	1475	8	3	3	\N	f	\N
1481	1475	7	3	3	\N	f	\N
1482	1476	9	2	4	\N	f	\N
1483	1476	8	2	4	\N	f	\N
1484	1476	7	1	3	\N	f	\N
1485	1477	9	3	3	\N	f	\N
1486	1477	8	3	4	\N	f	\N
1487	1478	9	2	4	\N	f	\N
1488	1478	8	2	4	\N	f	\N
1489	1478	7	1	3	\N	f	\N
1490	1479	9	4	4	\N	f	\N
1491	1479	8	4	4	\N	f	\N
1492	1479	7	4	3	\N	f	\N
1493	1480	9	3	3	\N	f	\N
1494	1480	8	3	2	\N	f	\N
1495	1480	7	2	3	\N	f	\N
1496	1481	9	3	3	\N	f	\N
1497	1481	8	4	3	\N	f	\N
1498	1481	7	2	3	\N	f	\N
1499	1482	9	4	4	\N	f	\N
1501	1482	8	4	4	\N	f	\N
1502	1483	9	3	3	\N	f	\N
1503	1483	8	3	3	\N	f	\N
1504	1483	7	3	3	\N	f	\N
1505	1484	9	2	3	\N	f	\N
1506	1484	8	2	3	\N	f	\N
1507	1484	7	2	3	\N	f	\N
1508	1485	9	3	3	\N	f	\N
1509	1485	8	4	3	\N	f	\N
1510	1485	7	4	2	\N	f	\N
1511	1486	9	3	3	\N	f	\N
1512	1486	8	2	4	\N	f	\N
1513	1486	7	2	3	\N	f	\N
1514	1487	9	4	3	\N	f	\N
1515	1487	8	3	3	\N	f	\N
1516	1487	7	3	3	\N	f	\N
1517	1488	8	3	4	\N	f	\N
1518	1489	9	3	3	\N	f	\N
1519	1489	8	3	3	\N	f	\N
1520	1490	9	3	4	\N	f	\N
1521	1490	8	4	3	\N	f	\N
1522	1490	7	4	3	\N	f	\N
1525	1490	2	4	3	\N	f	\N
1526	1490	1	4	3	\N	f	\N
1527	1491	9	3	4	\N	f	\N
1528	1491	8	3	4	\N	f	\N
1529	1492	9	3	4	\N	f	\N
1530	1492	8	3	3	\N	f	\N
1531	1493	9	3	3	\N	f	\N
1532	1493	8	4	3	\N	f	\N
1533	1494	9	4	3	\N	f	\N
1534	1495	9	2	2	\N	f	\N
1535	1495	8	2	3	\N	f	\N
1536	1496	9	4	3	\N	f	\N
1537	1496	8	4	4	\N	f	\N
1538	1497	9	2	4	\N	f	\N
1539	1498	9	4	4	\N	f	\N
1540	1499	9	3	2	\N	f	\N
1541	1499	8	3	2	\N	f	\N
1542	1500	9	4	3	\N	f	\N
1543	1500	8	3	3	\N	f	\N
1544	1501	9	3	3	\N	f	\N
1545	1502	9	3	4	\N	f	\N
1546	1502	8	2	3	\N	f	\N
1547	1503	9	3	3	\N	f	\N
1548	1503	8	3	3	\N	f	\N
1549	1504	9	3	3	\N	f	\N
1550	1504	8	3	3	\N	f	\N
1551	1505	9	3	3	\N	f	\N
1552	1505	8	3	3	\N	f	\N
1553	1506	9	3	3	\N	f	\N
1554	1506	8	3	3	\N	f	\N
1555	1507	9	3	3	\N	f	\N
1556	1507	8	3	4	\N	f	\N
1557	1508	9	3	2	\N	f	\N
1558	1509	9	3	4	\N	f	\N
1559	1509	8	2	3	\N	f	\N
1560	1510	9	2	3	\N	f	\N
1561	1510	8	3	2	\N	f	\N
1562	1511	9	3	4	\N	f	\N
1563	1512	9	2	4	\N	f	\N
1564	1512	8	3	3	\N	f	\N
1565	1513	9	3	3	\N	f	\N
1566	1513	8	3	3	\N	f	\N
1567	1514	9	3	3	\N	f	\N
1568	1514	8	2	3	\N	f	\N
1569	1515	9	4	3	\N	f	\N
1570	1515	8	4	3	\N	f	\N
1571	1516	9	4	3	\N	f	\N
1572	1516	8	3	3	\N	f	\N
1573	1516	2	4	3	\N	f	\N
1574	1516	1	4	3	\N	f	\N
1575	1517	8	3	4	\N	f	\N
1576	1518	9	3	3	\N	f	\N
1577	1518	8	2	3	\N	f	\N
1578	1519	9	3	3	\N	f	\N
1579	1519	8	4	3	\N	f	\N
1580	1520	9	3	3	\N	f	\N
1581	1521	9	3	4	\N	f	\N
1582	1521	8	3	2	\N	f	\N
1583	1521	7	3	3	\N	f	\N
1584	1521	6	3	3	\N	f	\N
1585	1521	5	4	3	\N	f	\N
1586	1521	4	4	4	\N	f	\N
1587	1521	3	4	4	\N	f	\N
1589	1521	2	2	4	\N	f	\N
1590	1521	1	3	4	\N	f	\N
1591	1522	9	3	3	\N	f	\N
1592	1523	9	2	3	\N	f	\N
1593	1525	9	3	3	\N	f	\N
1594	1526	9	3	3	\N	f	\N
1595	1528	9	4	3	\N	f	\N
1596	1536	9	3	3	\N	f	\N
1597	1537	9	3	3	\N	f	\N
1598	1538	9	3	3	\N	f	\N
1599	1539	9	3	3	\N	f	\N
1600	1541	4	4	3	\N	f	\N
1601	1541	3	3	4	\N	f	\N
1603	1541	2	4	3	\N	f	\N
1625	1541	5	4	4	\N	f	\N
1644	1541	1	4	4	\N	f	\N
1645	1541	8	3	3	\N	f	\N
1646	1541	7	2	3	\N	f	\N
1648	1356	10	3	3	1	t	35
1647	1362	10	3	3	1	t	35
1649	1444	10	3	3	1	t	32
1650	1417	10	4	2	1	t	35
\.


--
-- Name: pvp_pvpevaluation_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('pvp_pvpevaluation_id_seq', 1650, true);


--
-- Data for Name: south_migrationhistory; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY south_migrationhistory (id, app_name, migration, applied) FROM stdin;
1	org	0001_initial	2014-03-03 19:03:03.526754-05
2	org	0002_auto__add_field_employee_full_name	2014-03-03 19:03:03.575413-05
3	org	0003_convert_names	2014-03-03 19:03:03.608719-05
4	org	0004_auto__del_field_employee_informal_name	2014-03-03 19:03:03.62988-05
5	org	0005_auto__add_leadership	2014-03-03 19:03:03.700975-05
6	org	0006_auto__add_field_employee_avatar	2014-03-03 19:03:03.763798-05
7	org	0007_auto__add_attribute__add_attributecategory	2014-03-03 19:03:03.878899-05
8	org	0008_auto__add_field_employee_user	2014-03-03 19:03:03.950844-05
9	org	0009_auto__add_field_employee_avatar_small	2014-03-03 19:03:04.001441-05
10	org	0010_auto__add_field_leadership_start_date__add_field_leadership_end_date	2014-03-03 19:03:04.068944-05
11	org	0011_auto__chg_field_leadership_start_date__chg_field_leadership_end_date	2014-03-03 19:03:04.241641-05
12	org	0012_auto__del_field_leadership_start_date	2014-03-03 19:03:04.285327-05
13	org	0013_auto__add_field_leadership_start_date	2014-03-03 19:03:04.376092-05
14	comp	0001_initial	2014-03-03 19:41:01.456137-05
15	pvp	0001_initial	2014-03-03 19:41:14.469249-05
16	blah	0001_initial	2014-03-03 19:41:24.266115-05
17	todo	0001_initial	2014-03-03 19:41:36.602634-05
18	todo	0002_auto__del_field_task_status__add_field_task_completed	2014-03-03 19:41:36.682792-05
19	todo	0003_auto__add_field_task_assigned_by	2014-03-03 19:41:36.762971-05
20	engagement	0001_initial	2014-03-03 20:56:17.778579-05
21	org	0014_auto__add_field_employee_departure_date	2015-01-09 14:47:53.392128-05
22	org	0015_auto__add_field_employee_coach	2015-01-09 14:47:53.504207-05
23	org	0016_auto__chg_field_employee_coach	2015-01-09 14:47:53.693639-05
24	assessment	0001_initial	2015-01-09 14:50:41.443167-05
25	assessment	0002_auto__chg_field_assessmentcomparison_description__chg_field_assessment	2015-01-09 14:50:41.57364-05
26	assessment	0003_auto__add_teamassessmentcluster	2015-01-09 14:50:41.693591-05
27	assessment	0004_auto__add_mbtiteamdescription__add_mbtiemployeedescription__add_mbti	2015-01-09 14:50:41.880608-05
28	kpi	0001_initial	2015-01-09 14:52:46.508595-05
29	blah	0002_auto__add_field_comment_visibility	2015-02-12 08:34:53.833941-05
30	org	0017_auto__add_field_employee_first_name__add_field_employee_last_name	2015-02-12 08:35:10.815274-05
33	pvp	0002_auto__add_pvpevaluationassignment__add_unique_pvpevaluationassignment_	2015-02-12 08:35:38.343468-05
34	pvp	0003_auto__add_field_pvpevaluation_evaluator__add_field_pvpevaluation_is_co	2015-02-12 08:35:38.446824-05
35	pvp	0004_auto__del_pvpevaluationassignment__del_unique_pvpevaluationassignment_	2015-02-12 08:35:38.541221-05
36	pvp	0005_auto__add_field_evaluationround_is_complete	2015-02-12 08:35:38.587182-05
37	pvp	0006_mark_existing_rounds_complete	2015-02-12 08:35:38.649167-05
38	pvp	0007_auto__add_pvpdescription	2015-02-12 08:35:38.695279-05
42	org	0018_auto__del_field_employee_base_camp__del_field_employee_u_name__add_fie	2015-02-12 10:09:56.256253-05
43	pvp	0008_auto__add_field_pvpevaluation_comment	2015-02-12 10:12:07.599665-05
\.


--
-- Name: south_migrationhistory_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('south_migrationhistory_id_seq', 43, true);


--
-- Data for Name: static_precompiler_dependency; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY static_precompiler_dependency (id, source, depends_on) FROM stdin;
\.


--
-- Name: static_precompiler_dependency_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('static_precompiler_dependency_id_seq', 1, false);


--
-- Data for Name: todo_task; Type: TABLE DATA; Schema: demo; Owner: scoutmap
--

COPY todo_task (id, created_by_id, assigned_to_id, employee_id, created_date, due_date, description, completed, assigned_by_id) FROM stdin;
3	1360	1360	1417	2014-03-03	2014-03-25	Check-in with Harold	t	1360
7	1498	\N	1356	2015-01-15	\N	Check compenstaion	f	\N
8	1498	1362	1356	2015-01-15	2015-01-05	Check compenstaion	f	1498
9	1541	1362	1372	2015-01-16	2015-01-06	check aboutrelationghips	f	1541
10	1541	\N	1430	2015-01-27	\N	hit 3 ME's in biotech	f	\N
4	1498	1400	1417	2014-03-26	2014-04-08	Set Chris up with a mentorship with our COO	f	1360
1	1360	1360	1362	2014-03-03	2014-03-25	Review Amber's compensation	f	1360
5	1360	\N	1306	2014-04-03	\N	Find a new project	f	\N
6	1360	\N	1306	2014-04-03	\N	Find a new project	f	\N
2	1498	1498	1396	2014-03-03	2015-02-26	See if Jen is ready for a new challenge	f	1498
\.


--
-- Name: todo_task_id_seq; Type: SEQUENCE SET; Schema: demo; Owner: scoutmap
--

SELECT pg_catalog.setval('todo_task_id_seq', 10, true);


SET search_path = public, pg_catalog;

--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY auth_group (id, name) FROM stdin;
1	AllAccess
2	CoachAccess
3	Daily Digest Subscribers
4	Edit Employee
5	TeamLeadAccess
6	View Comments
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_group_id_seq', 6, true);


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_group_permissions_id_seq', 1, false);


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add evaluation round	1	add_evaluationround
2	Can change evaluation round	1	change_evaluationround
3	Can delete evaluation round	1	delete_evaluationround
4	Can add PVP Evaluation	3	add_pvpevaluation
5	Can change PVP Evaluation	3	change_pvpevaluation
6	Can delete PVP Evaluation	3	delete_pvpevaluation
7	Can add pvp description	2	add_pvpdescription
8	Can change pvp description	2	change_pvpdescription
9	Can delete pvp description	2	delete_pvpdescription
10	Can add feedback request	5	add_feedbackrequest
11	Can change feedback request	5	change_feedbackrequest
12	Can delete feedback request	5	delete_feedbackrequest
13	Can add feedback submission	4	add_feedbacksubmission
14	Can change feedback submission	4	change_feedbacksubmission
15	Can delete feedback submission	4	delete_feedbacksubmission
16	Can add comment	6	add_comment
17	Can change comment	6	change_comment
18	Can delete comment	6	delete_comment
19	Can add task	7	add_task
20	Can change task	7	change_task
21	Can delete task	7	delete_task
22	Can add session	8	add_session
23	Can change session	8	change_session
24	Can delete session	8	delete_session
25	Can add happiness	10	add_happiness
26	Can change happiness	10	change_happiness
27	Can delete happiness	10	delete_happiness
28	Can add survey url	9	add_surveyurl
29	Can change survey url	9	change_surveyurl
30	Can delete survey url	9	delete_surveyurl
31	Can add mbti employee description	15	add_mbtiemployeedescription
32	Can change mbti employee description	15	change_mbtiemployeedescription
33	Can delete mbti employee description	15	delete_mbtiemployeedescription
34	Can add mbti team description	11	add_mbtiteamdescription
35	Can change mbti team description	11	change_mbtiteamdescription
36	Can delete mbti team description	11	delete_mbtiteamdescription
37	Can add mbti	19	add_mbti
38	Can change mbti	19	change_mbti
39	Can delete mbti	19	delete_mbti
40	Can add assessment type	12	add_assessmenttype
41	Can change assessment type	12	change_assessmenttype
42	Can delete assessment type	12	delete_assessmenttype
43	Can add assessment category	13	add_assessmentcategory
44	Can change assessment category	13	change_assessmentcategory
45	Can delete assessment category	13	delete_assessmentcategory
46	Can add assessment band	14	add_assessmentband
47	Can change assessment band	14	change_assessmentband
48	Can delete assessment band	14	delete_assessmentband
49	Can add employee assessment	16	add_employeeassessment
50	Can change employee assessment	16	change_employeeassessment
51	Can delete employee assessment	16	delete_employeeassessment
52	Can add assessment comparison	17	add_assessmentcomparison
53	Can change assessment comparison	17	change_assessmentcomparison
54	Can delete assessment comparison	17	delete_assessmentcomparison
55	Can add team assessment cluster	18	add_teamassessmentcluster
56	Can change team assessment cluster	18	change_teamassessmentcluster
57	Can delete team assessment cluster	18	delete_teamassessmentcluster
58	Can add customer	20	add_customer
59	Can change customer	20	change_customer
60	Can delete customer	20	delete_customer
61	Can add compensation summary	21	add_compensationsummary
62	Can change compensation summary	21	change_compensationsummary
63	Can delete compensation summary	21	delete_compensationsummary
64	Can add log entry	22	add_logentry
65	Can change log entry	22	change_logentry
66	Can delete log entry	22	delete_logentry
67	Can add employee	26	add_employee
68	Can change employee	26	change_employee
69	Can delete employee	26	delete_employee
70	Can add team	25	add_team
71	Can change team	25	change_team
72	Can delete team	25	delete_team
73	Can add mentorship	28	add_mentorship
74	Can change mentorship	28	change_mentorship
75	Can delete mentorship	28	delete_mentorship
76	Can add leadership	24	add_leadership
77	Can change leadership	24	change_leadership
78	Can delete leadership	24	delete_leadership
79	Can add attribute	23	add_attribute
80	Can change attribute	23	change_attribute
81	Can delete attribute	23	delete_attribute
82	Can add attribute category	27	add_attributecategory
83	Can change attribute category	27	change_attributecategory
84	Can delete attribute category	27	delete_attributecategory
85	Can add dependency	29	add_dependency
86	Can change dependency	29	change_dependency
87	Can delete dependency	29	delete_dependency
88	Can add content type	30	add_contenttype
89	Can change content type	30	change_contenttype
90	Can delete content type	30	delete_contenttype
91	Can add permission	33	add_permission
92	Can change permission	33	change_permission
93	Can delete permission	33	delete_permission
94	Can add group	31	add_group
95	Can change group	31	change_group
96	Can delete group	31	delete_group
97	Can add user	32	add_user
98	Can change user	32	change_user
99	Can delete user	32	delete_user
100	Can add indicator	35	add_indicator
101	Can change indicator	35	change_indicator
102	Can delete indicator	35	delete_indicator
103	Can add performance	34	add_performance
104	Can change performance	34	change_performance
105	Can delete performance	34	delete_performance
\.


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_permission_id_seq', 105, true);


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
1	!sI2ViKas35tcU5FkdQP4jh2tFzX1WO4L9PSB5usE	2015-04-13 10:22:31.992492-04	t	publicadmin				t	t	2015-04-13 10:22:31.992579-04
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_user_id_seq', 1, true);


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('auth_user_user_permissions_id_seq', 1, false);


--
-- Data for Name: customers_customer; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY customers_customer (id, domain_url, schema_name, name, created_on, show_kolbe, show_vops, show_mbti, show_coaches, show_timeline, survey_email_body, survey_email_subject) FROM stdin;
1	localhost	public	Local Host	2015-04-13	f	f	f	f	f		
2	demo.localhost	demo	Demo, Inc.	2015-04-13	f	f	f	f	f		
\.


--
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('customers_customer_id_seq', 2, true);


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('django_admin_log_id_seq', 1, false);


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY django_content_type (id, name, app_label, model) FROM stdin;
1	evaluation round	pvp	evaluationround
2	pvp description	pvp	pvpdescription
3	PVP Evaluation	pvp	pvpevaluation
4	feedback submission	feedback	feedbacksubmission
5	feedback request	feedback	feedbackrequest
6	comment	blah	comment
7	task	todo	task
8	session	sessions	session
9	survey url	engagement	surveyurl
10	happiness	engagement	happiness
11	mbti team description	assessment	mbtiteamdescription
12	assessment type	assessment	assessmenttype
13	assessment category	assessment	assessmentcategory
14	assessment band	assessment	assessmentband
15	mbti employee description	assessment	mbtiemployeedescription
16	employee assessment	assessment	employeeassessment
17	assessment comparison	assessment	assessmentcomparison
18	team assessment cluster	assessment	teamassessmentcluster
19	mbti	assessment	mbti
20	customer	customers	customer
21	compensation summary	comp	compensationsummary
22	log entry	admin	logentry
23	attribute	org	attribute
24	leadership	org	leadership
25	team	org	team
26	employee	org	employee
27	attribute category	org	attributecategory
28	mentorship	org	mentorship
29	dependency	static_precompiler	dependency
30	content type	contenttypes	contenttype
31	group	auth	group
32	user	auth	user
33	permission	auth	permission
34	performance	kpi	performance
35	indicator	kpi	indicator
\.


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('django_content_type_id_seq', 35, true);


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2015-04-13 10:22:02.757741-04
2	auth	0001_initial	2015-04-13 10:22:02.870448-04
3	admin	0001_initial	2015-04-13 10:22:02.944196-04
4	org	0001_initial	2015-04-13 10:22:03.149595-04
5	assessment	0001_initial	2015-04-13 10:22:03.503122-04
6	blah	0001_initial	2015-04-13 10:22:03.51455-04
7	comp	0001_initial	2015-04-13 10:22:03.571316-04
8	customers	0001_initial	2015-04-13 10:22:03.589276-04
9	customers	0002_auto_20150410_1616	2015-04-13 10:22:03.658782-04
10	org	0002_employee_linkedin_id	2015-04-13 10:22:03.718981-04
11	engagement	0001_initial	2015-04-13 10:22:03.774755-04
12	engagement	0002_happiness_comment	2015-04-13 10:22:03.8704-04
13	engagement	0003_surveyurl	2015-04-13 10:22:04.0046-04
14	engagement	0004_auto_20150304_0935	2015-04-13 10:22:04.184116-04
15	engagement	0005_auto_20150304_0937	2015-04-13 10:22:04.329584-04
16	feedback	0001_initial	2015-04-13 10:22:04.415123-04
17	feedback	0002_auto_20150324_1346	2015-04-13 10:22:04.576109-04
18	feedback	0003_auto_20150326_1508	2015-04-13 10:22:04.688376-04
19	feedback	0004_feedbackrequest_was_declined	2015-04-13 10:22:04.801479-04
20	kpi	0001_initial	2015-04-13 10:22:04.81074-04
21	pvp	0001_initial	2015-04-13 10:22:04.97198-04
22	sessions	0001_initial	2015-04-13 10:22:04.986684-04
23	static_precompiler	0001_initial	2015-04-13 10:22:04.994711-04
24	todo	0001_initial	2015-04-13 10:22:05.058672-04
25	todo	0002_auto_20150409_1304	2015-04-13 10:22:05.127394-04
\.


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: scoutmap
--

SELECT pg_catalog.setval('django_migrations_id_seq', 25, true);


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: scoutmap
--

COPY django_session (session_key, session_data, expire_date) FROM stdin;
ie901x3ahsxqw3lis40tlu5obt3esxo5	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 13:31:56.219679-04
nhbfo5myw9n8diw8ghxh4jd9t52ldxeb	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 13:38:56.489962-04
ai64pcmgdwy0r6y6ssm0crehey0bny5e	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 13:45:33.160933-04
inhksi6d7ank1jcwiw3vig0vqb9fhxye	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 13:52:42.958272-04
vpqkhiz4nmhqywi9jambkeome620z9x0	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 13:53:05.235914-04
7r2vcqk7efzmgptsfrxb8toyeviulh6i	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 13:55:02.846229-04
5d0rk0h8rv2mvafe798hp5v4d95nt76m	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 14:11:45.330742-04
936mv7hg1tx2uovlwy4qsuolggqsoqde	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 14:12:00.744669-04
vpqil4j4ob55qlqtfft6emsyhqvdt90g	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 14:12:23.506899-04
o7x9lwduxzchzkw5ghb9eqvjj5wyle9g	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 14:13:38.985263-04
v8nca9fqj67hwojvrmk3vv8e75b1ej9h	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 14:17:30.372504-04
t632fns42pha261brccw8faonqq7o7lg	MzBkM2FhZDNhMTQ2MWI4MDlhMzM1NjU4NWUxMTJlYTIxNWE2NDBmYjp7fQ==	2015-05-07 14:18:15.874916-04
\.


SET search_path = demo, pg_catalog;

--
-- Name: assessment_assessmentband_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_assessmentband
    ADD CONSTRAINT assessment_assessmentband_pkey PRIMARY KEY (id);


--
-- Name: assessment_assessmentcategory_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_assessmentcategory
    ADD CONSTRAINT assessment_assessmentcategory_pkey PRIMARY KEY (id);


--
-- Name: assessment_assessmentcomparison_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_assessmentcomparison
    ADD CONSTRAINT assessment_assessmentcomparison_pkey PRIMARY KEY (id);


--
-- Name: assessment_assessmenttype_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_assessmenttype
    ADD CONSTRAINT assessment_assessmenttype_pkey PRIMARY KEY (id);


--
-- Name: assessment_employeeassessment_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_employeeassessment
    ADD CONSTRAINT assessment_employeeassessment_pkey PRIMARY KEY (id);


--
-- Name: assessment_mbti_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_mbti
    ADD CONSTRAINT assessment_mbti_pkey PRIMARY KEY (id);


--
-- Name: assessment_mbtiemployeedescription_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_mbtiemployeedescription
    ADD CONSTRAINT assessment_mbtiemployeedescription_pkey PRIMARY KEY (id);


--
-- Name: assessment_mbtiteamdescription_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_mbtiteamdescription
    ADD CONSTRAINT assessment_mbtiteamdescription_pkey PRIMARY KEY (id);


--
-- Name: assessment_teama_teamassessmentcluster_id_2f822e91db895f70_uniq; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_teamassessmentcluster_bands
    ADD CONSTRAINT assessment_teama_teamassessmentcluster_id_2f822e91db895f70_uniq UNIQUE (teamassessmentcluster_id, assessmentband_id);


--
-- Name: assessment_teamassessmentcluster_bands_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_teamassessmentcluster_bands
    ADD CONSTRAINT assessment_teamassessmentcluster_bands_pkey PRIMARY KEY (id);


--
-- Name: assessment_teamassessmentcluster_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY assessment_teamassessmentcluster
    ADD CONSTRAINT assessment_teamassessmentcluster_pkey PRIMARY KEY (id);


--
-- Name: auth_group_name_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions_group_id_permission_id_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_key UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission_content_type_id_codename_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_key UNIQUE (content_type_id, codename);


--
-- Name: auth_permission_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups_user_id_group_id_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_key UNIQUE (user_id, group_id);


--
-- Name: auth_user_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions_user_id_permission_id_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_key UNIQUE (user_id, permission_id);


--
-- Name: auth_user_username_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: blah_comment_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY blah_comment
    ADD CONSTRAINT blah_comment_pkey PRIMARY KEY (id);


--
-- Name: comp_compensationsummary_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY comp_compensationsummary
    ADD CONSTRAINT comp_compensationsummary_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type_app_label_model_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_key UNIQUE (app_label, model);


--
-- Name: django_content_type_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: django_site_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_site
    ADD CONSTRAINT django_site_pkey PRIMARY KEY (id);


--
-- Name: engagement_happiness_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY engagement_happiness
    ADD CONSTRAINT engagement_happiness_pkey PRIMARY KEY (id);


--
-- Name: engagement_surveyurl_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY engagement_surveyurl
    ADD CONSTRAINT engagement_surveyurl_pkey PRIMARY KEY (id);


--
-- Name: feedback_feedbackrequest_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY feedback_feedbackrequest
    ADD CONSTRAINT feedback_feedbackrequest_pkey PRIMARY KEY (id);


--
-- Name: feedback_feedbacksubmission_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY feedback_feedbacksubmission
    ADD CONSTRAINT feedback_feedbacksubmission_pkey PRIMARY KEY (id);


--
-- Name: kpi_indicator_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY kpi_indicator
    ADD CONSTRAINT kpi_indicator_pkey PRIMARY KEY (id);


--
-- Name: kpi_performance_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY kpi_performance
    ADD CONSTRAINT kpi_performance_pkey PRIMARY KEY (id);


--
-- Name: org_attribute_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY org_attribute
    ADD CONSTRAINT org_attribute_pkey PRIMARY KEY (id);


--
-- Name: org_attributecategory_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY org_attributecategory
    ADD CONSTRAINT org_attributecategory_pkey PRIMARY KEY (id);


--
-- Name: org_employee_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY org_employee
    ADD CONSTRAINT org_employee_pkey PRIMARY KEY (id);


--
-- Name: org_employee_user_id_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY org_employee
    ADD CONSTRAINT org_employee_user_id_key UNIQUE (user_id);


--
-- Name: org_leadership_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY org_leadership
    ADD CONSTRAINT org_leadership_pkey PRIMARY KEY (id);


--
-- Name: org_mentorship_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY org_mentorship
    ADD CONSTRAINT org_mentorship_pkey PRIMARY KEY (id);


--
-- Name: org_team_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY org_team
    ADD CONSTRAINT org_team_pkey PRIMARY KEY (id);


--
-- Name: preferences_sitepreferences_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY preferences_sitepreferences
    ADD CONSTRAINT preferences_sitepreferences_pkey PRIMARY KEY (id);


--
-- Name: preferences_sitepreferences_site_id_key; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY preferences_sitepreferences
    ADD CONSTRAINT preferences_sitepreferences_site_id_key UNIQUE (site_id);


--
-- Name: pvp_evaluationround_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY pvp_evaluationround
    ADD CONSTRAINT pvp_evaluationround_pkey PRIMARY KEY (id);


--
-- Name: pvp_pvpdescription_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY pvp_pvpdescription
    ADD CONSTRAINT pvp_pvpdescription_pkey PRIMARY KEY (id);


--
-- Name: pvp_pvpevaluation_employee_id_585a6bb43f65cb65_uniq; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY pvp_pvpevaluation
    ADD CONSTRAINT pvp_pvpevaluation_employee_id_585a6bb43f65cb65_uniq UNIQUE (employee_id, evaluation_round_id);


--
-- Name: pvp_pvpevaluation_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY pvp_pvpevaluation
    ADD CONSTRAINT pvp_pvpevaluation_pkey PRIMARY KEY (id);


--
-- Name: south_migrationhistory_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY south_migrationhistory
    ADD CONSTRAINT south_migrationhistory_pkey PRIMARY KEY (id);


--
-- Name: static_precompiler_dependency_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY static_precompiler_dependency
    ADD CONSTRAINT static_precompiler_dependency_pkey PRIMARY KEY (id);


--
-- Name: static_precompiler_dependency_source_46b84c536e24ac66_uniq; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY static_precompiler_dependency
    ADD CONSTRAINT static_precompiler_dependency_source_46b84c536e24ac66_uniq UNIQUE (source, depends_on);


--
-- Name: todo_task_pkey; Type: CONSTRAINT; Schema: demo; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY todo_task
    ADD CONSTRAINT todo_task_pkey PRIMARY KEY (id);


SET search_path = public, pg_catalog;

--
-- Name: auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions_group_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_key UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission_content_type_id_codename_key; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_key UNIQUE (content_type_id, codename);


--
-- Name: auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups_user_id_group_id_key; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_key UNIQUE (user_id, group_id);


--
-- Name: auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions_user_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_key UNIQUE (user_id, permission_id);


--
-- Name: auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: customers_customer_domain_url_key; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY customers_customer
    ADD CONSTRAINT customers_customer_domain_url_key UNIQUE (domain_url);


--
-- Name: customers_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY customers_customer
    ADD CONSTRAINT customers_customer_pkey PRIMARY KEY (id);


--
-- Name: customers_customer_schema_name_key; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY customers_customer
    ADD CONSTRAINT customers_customer_schema_name_key UNIQUE (schema_name);


--
-- Name: django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type_app_label_45f3b1d93ec8c61c_uniq; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_content_type
    ADD CONSTRAINT django_content_type_app_label_45f3b1d93ec8c61c_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: scoutmap; Tablespace: 
--

ALTER TABLE ONLY django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


SET search_path = demo, pg_catalog;

--
-- Name: assessment_assessmentband_category_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_assessmentband_category_id ON assessment_assessmentband USING btree (category_id);


--
-- Name: assessment_assessmentcategory_assessment_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_assessmentcategory_assessment_id ON assessment_assessmentcategory USING btree (assessment_id);


--
-- Name: assessment_assessmentcomparison_that_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_assessmentcomparison_that_id ON assessment_assessmentcomparison USING btree (that_id);


--
-- Name: assessment_assessmentcomparison_this_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_assessmentcomparison_this_id ON assessment_assessmentcomparison USING btree (this_id);


--
-- Name: assessment_employeeassessment_category_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_employeeassessment_category_id ON assessment_employeeassessment USING btree (category_id);


--
-- Name: assessment_employeeassessment_employee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_employeeassessment_employee_id ON assessment_employeeassessment USING btree (employee_id);


--
-- Name: assessment_mbti_employee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_mbti_employee_id ON assessment_mbti USING btree (employee_id);


--
-- Name: assessment_teamassessmentcluster_bands_assessmentband_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_teamassessmentcluster_bands_assessmentband_id ON assessment_teamassessmentcluster_bands USING btree (assessmentband_id);


--
-- Name: assessment_teamassessmentcluster_bands_teamassessmentcluster_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX assessment_teamassessmentcluster_bands_teamassessmentcluster_id ON assessment_teamassessmentcluster_bands USING btree (teamassessmentcluster_id);


--
-- Name: auth_group_name_like; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_group_name_like ON auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_group_permissions_group_id ON auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_group_permissions_permission_id ON auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_permission_content_type_id ON auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_groups_group_id ON auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_groups_user_id ON auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_user_permissions_permission_id ON auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_user_permissions_user_id ON auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_like; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_username_like ON auth_user USING btree (username varchar_pattern_ops);


--
-- Name: blah_comment_content_type_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX blah_comment_content_type_id ON blah_comment USING btree (content_type_id);


--
-- Name: blah_comment_object_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX blah_comment_object_id ON blah_comment USING btree (object_id);


--
-- Name: blah_comment_owner_content_type_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX blah_comment_owner_content_type_id ON blah_comment USING btree (owner_content_type_id);


--
-- Name: blah_comment_owner_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX blah_comment_owner_id ON blah_comment USING btree (owner_id);


--
-- Name: comp_compensationsummary_employee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX comp_compensationsummary_employee_id ON comp_compensationsummary USING btree (employee_id);


--
-- Name: django_admin_log_content_type_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX django_admin_log_content_type_id ON django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX django_admin_log_user_id ON django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX django_session_expire_date ON django_session USING btree (expire_date);


--
-- Name: django_session_session_key_like; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX django_session_session_key_like ON django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: engagement_happiness_69b97d17; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX engagement_happiness_69b97d17 ON engagement_happiness USING btree (comment_id);


--
-- Name: engagement_happiness_assessed_by_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX engagement_happiness_assessed_by_id ON engagement_happiness USING btree (assessed_by_id);


--
-- Name: engagement_happiness_employee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX engagement_happiness_employee_id ON engagement_happiness USING btree (employee_id);


--
-- Name: engagement_surveyurl_7a5357d9; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX engagement_surveyurl_7a5357d9 ON engagement_surveyurl USING btree (sent_from_id);


--
-- Name: engagement_surveyurl_a39b5ebd; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX engagement_surveyurl_a39b5ebd ON engagement_surveyurl USING btree (sent_to_id);


--
-- Name: feedback_feedbackrequest_071d8141; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX feedback_feedbackrequest_071d8141 ON feedback_feedbackrequest USING btree (reviewer_id);


--
-- Name: feedback_feedbackrequest_573f8683; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX feedback_feedbackrequest_573f8683 ON feedback_feedbackrequest USING btree (requester_id);


--
-- Name: feedback_feedbacksubmission_071d8141; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX feedback_feedbacksubmission_071d8141 ON feedback_feedbacksubmission USING btree (reviewer_id);


--
-- Name: feedback_feedbacksubmission_d137e12e; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX feedback_feedbacksubmission_d137e12e ON feedback_feedbacksubmission USING btree (feedback_request_id);


--
-- Name: feedback_feedbacksubmission_ffaba1d1; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX feedback_feedbacksubmission_ffaba1d1 ON feedback_feedbacksubmission USING btree (subject_id);


--
-- Name: org_attribute_category_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_attribute_category_id ON org_attribute USING btree (category_id);


--
-- Name: org_attribute_employee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_attribute_employee_id ON org_attribute USING btree (employee_id);


--
-- Name: org_employee_coach_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_employee_coach_id ON org_employee USING btree (coach_id);


--
-- Name: org_employee_team_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_employee_team_id ON org_employee USING btree (team_id);


--
-- Name: org_leadership_employee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_leadership_employee_id ON org_leadership USING btree (employee_id);


--
-- Name: org_leadership_leader_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_leadership_leader_id ON org_leadership USING btree (leader_id);


--
-- Name: org_mentorship_mentee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_mentorship_mentee_id ON org_mentorship USING btree (mentee_id);


--
-- Name: org_mentorship_mentor_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_mentorship_mentor_id ON org_mentorship USING btree (mentor_id);


--
-- Name: org_team_leader_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX org_team_leader_id ON org_team USING btree (leader_id);


--
-- Name: pvp_pvpevaluation_comment_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX pvp_pvpevaluation_comment_id ON pvp_pvpevaluation USING btree (comment_id);


--
-- Name: pvp_pvpevaluation_employee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX pvp_pvpevaluation_employee_id ON pvp_pvpevaluation USING btree (employee_id);


--
-- Name: pvp_pvpevaluation_evaluation_round_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX pvp_pvpevaluation_evaluation_round_id ON pvp_pvpevaluation USING btree (evaluation_round_id);


--
-- Name: pvp_pvpevaluation_evaluator_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX pvp_pvpevaluation_evaluator_id ON pvp_pvpevaluation USING btree (evaluator_id);


--
-- Name: static_precompiler_dependency_1f903a40; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX static_precompiler_dependency_1f903a40 ON static_precompiler_dependency USING btree (depends_on);


--
-- Name: static_precompiler_dependency_36cd38f4; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX static_precompiler_dependency_36cd38f4 ON static_precompiler_dependency USING btree (source);


--
-- Name: static_precompiler_dependency_depends_on_1dc83670418ecc18_like; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX static_precompiler_dependency_depends_on_1dc83670418ecc18_like ON static_precompiler_dependency USING btree (depends_on varchar_pattern_ops);


--
-- Name: static_precompiler_dependency_source_4b8a9d276fa5f270_like; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX static_precompiler_dependency_source_4b8a9d276fa5f270_like ON static_precompiler_dependency USING btree (source varchar_pattern_ops);


--
-- Name: todo_task_assigned_by_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX todo_task_assigned_by_id ON todo_task USING btree (assigned_by_id);


--
-- Name: todo_task_assigned_to_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX todo_task_assigned_to_id ON todo_task USING btree (assigned_to_id);


--
-- Name: todo_task_created_by_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX todo_task_created_by_id ON todo_task USING btree (created_by_id);


--
-- Name: todo_task_employee_id; Type: INDEX; Schema: demo; Owner: scoutmap; Tablespace: 
--

CREATE INDEX todo_task_employee_id ON todo_task USING btree (employee_id);


SET search_path = public, pg_catalog;

--
-- Name: auth_group_name_253ae2a6331666e8_like; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_group_name_253ae2a6331666e8_like ON auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_0e939a4f; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_group_permissions_0e939a4f ON auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_8373b171; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_group_permissions_8373b171 ON auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_417f1b1c; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_permission_417f1b1c ON auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_0e939a4f; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_groups_0e939a4f ON auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_e8701ad4; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_groups_e8701ad4 ON auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_8373b171; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_user_permissions_8373b171 ON auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_e8701ad4; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_user_permissions_e8701ad4 ON auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_51b3b110094b8aae_like; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX auth_user_username_51b3b110094b8aae_like ON auth_user USING btree (username varchar_pattern_ops);


--
-- Name: customers_customer_domain_url_7faf5109b1596db3_like; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX customers_customer_domain_url_7faf5109b1596db3_like ON customers_customer USING btree (domain_url varchar_pattern_ops);


--
-- Name: customers_customer_schema_name_2a945df3df985523_like; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX customers_customer_schema_name_2a945df3df985523_like ON customers_customer USING btree (schema_name varchar_pattern_ops);


--
-- Name: django_admin_log_417f1b1c; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX django_admin_log_417f1b1c ON django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_e8701ad4; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX django_admin_log_e8701ad4 ON django_admin_log USING btree (user_id);


--
-- Name: django_session_de54fa62; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX django_session_de54fa62 ON django_session USING btree (expire_date);


--
-- Name: django_session_session_key_461cfeaa630ca218_like; Type: INDEX; Schema: public; Owner: scoutmap; Tablespace: 
--

CREATE INDEX django_session_session_key_461cfeaa630ca218_like ON django_session USING btree (session_key varchar_pattern_ops);


SET search_path = demo, pg_catalog;

--
-- Name: assessed_by_id_refs_id_7e80bd2f; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY engagement_happiness
    ADD CONSTRAINT assessed_by_id_refs_id_7e80bd2f FOREIGN KEY (assessed_by_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assessment_id_refs_id_aa8aa5c1; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_assessmentcategory
    ADD CONSTRAINT assessment_id_refs_id_aa8aa5c1 FOREIGN KEY (assessment_id) REFERENCES assessment_assessmenttype(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assessmentband_id_refs_id_9b004193; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_teamassessmentcluster_bands
    ADD CONSTRAINT assessmentband_id_refs_id_9b004193 FOREIGN KEY (assessmentband_id) REFERENCES assessment_assessmentband(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assigned_by_id_refs_id_9e4e0e94; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY todo_task
    ADD CONSTRAINT assigned_by_id_refs_id_9e4e0e94 FOREIGN KEY (assigned_by_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: assigned_to_id_refs_id_9e4e0e94; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY todo_task
    ADD CONSTRAINT assigned_to_id_refs_id_9e4e0e94 FOREIGN KEY (assigned_to_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: category_id_refs_id_6e040822; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_attribute
    ADD CONSTRAINT category_id_refs_id_6e040822 FOREIGN KEY (category_id) REFERENCES org_attributecategory(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: category_id_refs_id_800abcb7; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_assessmentband
    ADD CONSTRAINT category_id_refs_id_800abcb7 FOREIGN KEY (category_id) REFERENCES assessment_assessmentcategory(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: category_id_refs_id_8e364b53; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_employeeassessment
    ADD CONSTRAINT category_id_refs_id_8e364b53 FOREIGN KEY (category_id) REFERENCES assessment_assessmentcategory(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: coach_id_refs_id_f1d21610; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_employee
    ADD CONSTRAINT coach_id_refs_id_f1d21610 FOREIGN KEY (coach_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: comment_id_refs_id_a45e8cbd; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY pvp_pvpevaluation
    ADD CONSTRAINT comment_id_refs_id_a45e8cbd FOREIGN KEY (comment_id) REFERENCES blah_comment(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: content_type_id_refs_id_ac14a6dc; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY blah_comment
    ADD CONSTRAINT content_type_id_refs_id_ac14a6dc FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: content_type_id_refs_id_d043b34a; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT content_type_id_refs_id_d043b34a FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: created_by_id_refs_id_9e4e0e94; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY todo_task
    ADD CONSTRAINT created_by_id_refs_id_9e4e0e94 FOREIGN KEY (created_by_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: d5e32a6fc257567b6268049247c52ec9; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY feedback_feedbacksubmission
    ADD CONSTRAINT d5e32a6fc257567b6268049247c52ec9 FOREIGN KEY (feedback_request_id) REFERENCES feedback_feedbackrequest(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log_content_type_id_fkey; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_fkey FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log_user_id_fkey; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: employee_id_refs_id_1630138e; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_employeeassessment
    ADD CONSTRAINT employee_id_refs_id_1630138e FOREIGN KEY (employee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: employee_id_refs_id_1a8ad046; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_attribute
    ADD CONSTRAINT employee_id_refs_id_1a8ad046 FOREIGN KEY (employee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: employee_id_refs_id_1ced701b; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_mbti
    ADD CONSTRAINT employee_id_refs_id_1ced701b FOREIGN KEY (employee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: employee_id_refs_id_3e8146ec; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY comp_compensationsummary
    ADD CONSTRAINT employee_id_refs_id_3e8146ec FOREIGN KEY (employee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: employee_id_refs_id_7e80bd2f; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY engagement_happiness
    ADD CONSTRAINT employee_id_refs_id_7e80bd2f FOREIGN KEY (employee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: employee_id_refs_id_7fef637c; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_leadership
    ADD CONSTRAINT employee_id_refs_id_7fef637c FOREIGN KEY (employee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: employee_id_refs_id_9e4e0e94; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY todo_task
    ADD CONSTRAINT employee_id_refs_id_9e4e0e94 FOREIGN KEY (employee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: employee_id_refs_id_a493cc6a; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY pvp_pvpevaluation
    ADD CONSTRAINT employee_id_refs_id_a493cc6a FOREIGN KEY (employee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: engagement_happi_comment_id_2a1afd703a420113_fk_blah_comment_id; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY engagement_happiness
    ADD CONSTRAINT engagement_happi_comment_id_2a1afd703a420113_fk_blah_comment_id FOREIGN KEY (comment_id) REFERENCES blah_comment(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: engagement_sur_sent_from_id_43aaa250495ed4ef_fk_org_employee_id; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY engagement_surveyurl
    ADD CONSTRAINT engagement_sur_sent_from_id_43aaa250495ed4ef_fk_org_employee_id FOREIGN KEY (sent_from_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: engagement_surve_sent_to_id_45ee4423a46633ce_fk_org_employee_id; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY engagement_surveyurl
    ADD CONSTRAINT engagement_surve_sent_to_id_45ee4423a46633ce_fk_org_employee_id FOREIGN KEY (sent_to_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: evaluation_round_id_refs_id_a0946cb9; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY pvp_pvpevaluation
    ADD CONSTRAINT evaluation_round_id_refs_id_a0946cb9 FOREIGN KEY (evaluation_round_id) REFERENCES pvp_evaluationround(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: evaluator_id_refs_id_00d636dc; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY pvp_pvpevaluation
    ADD CONSTRAINT evaluator_id_refs_id_00d636dc FOREIGN KEY (evaluator_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: feedback_feedb_requester_id_31ff69cf410bb959_fk_org_employee_id; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY feedback_feedbackrequest
    ADD CONSTRAINT feedback_feedb_requester_id_31ff69cf410bb959_fk_org_employee_id FOREIGN KEY (requester_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: feedback_feedba_reviewer_id_23feb44978ed0d09_fk_org_employee_id; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY feedback_feedbackrequest
    ADD CONSTRAINT feedback_feedba_reviewer_id_23feb44978ed0d09_fk_org_employee_id FOREIGN KEY (reviewer_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: feedback_feedba_reviewer_id_3c70110fbd7200fb_fk_org_employee_id; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY feedback_feedbacksubmission
    ADD CONSTRAINT feedback_feedba_reviewer_id_3c70110fbd7200fb_fk_org_employee_id FOREIGN KEY (reviewer_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: feedback_feedbac_subject_id_5c2c44df1619c8c5_fk_org_employee_id; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY feedback_feedbacksubmission
    ADD CONSTRAINT feedback_feedbac_subject_id_5c2c44df1619c8c5_fk_org_employee_id FOREIGN KEY (subject_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: group_id_refs_id_f4b32aac; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT group_id_refs_id_f4b32aac FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: leader_id_refs_id_1fb1f576; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_team
    ADD CONSTRAINT leader_id_refs_id_1fb1f576 FOREIGN KEY (leader_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: leader_id_refs_id_7fef637c; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_leadership
    ADD CONSTRAINT leader_id_refs_id_7fef637c FOREIGN KEY (leader_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mentee_id_refs_id_09661bdf; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_mentorship
    ADD CONSTRAINT mentee_id_refs_id_09661bdf FOREIGN KEY (mentee_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mentor_id_refs_id_09661bdf; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_mentorship
    ADD CONSTRAINT mentor_id_refs_id_09661bdf FOREIGN KEY (mentor_id) REFERENCES org_employee(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: owner_content_type_id_refs_id_ac14a6dc; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY blah_comment
    ADD CONSTRAINT owner_content_type_id_refs_id_ac14a6dc FOREIGN KEY (owner_content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: preferences_sitepref_site_id_71098e06d8e025c2_fk_django_site_id; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY preferences_sitepreferences
    ADD CONSTRAINT preferences_sitepref_site_id_71098e06d8e025c2_fk_django_site_id FOREIGN KEY (site_id) REFERENCES django_site(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: team_id_refs_id_818d7514; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_employee
    ADD CONSTRAINT team_id_refs_id_818d7514 FOREIGN KEY (team_id) REFERENCES org_team(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: teamassessmentcluster_id_refs_id_3c3ddebe; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_teamassessmentcluster_bands
    ADD CONSTRAINT teamassessmentcluster_id_refs_id_3c3ddebe FOREIGN KEY (teamassessmentcluster_id) REFERENCES assessment_teamassessmentcluster(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: that_id_refs_id_d1c40fef; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_assessmentcomparison
    ADD CONSTRAINT that_id_refs_id_d1c40fef FOREIGN KEY (that_id) REFERENCES assessment_assessmentband(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: this_id_refs_id_d1c40fef; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY assessment_assessmentcomparison
    ADD CONSTRAINT this_id_refs_id_d1c40fef FOREIGN KEY (this_id) REFERENCES assessment_assessmentband(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: user_id_refs_id_40c41112; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT user_id_refs_id_40c41112 FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: user_id_refs_id_4dc23c39; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT user_id_refs_id_4dc23c39 FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: user_id_refs_id_df43dfdd; Type: FK CONSTRAINT; Schema: demo; Owner: scoutmap
--

ALTER TABLE ONLY org_employee
    ADD CONSTRAINT user_id_refs_id_df43dfdd FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


SET search_path = public, pg_catalog;

--
-- Name: auth_content_type_id_508cf46651277a81_fk_django_content_type_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_content_type_id_508cf46651277a81_fk_django_content_type_id FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissio_group_id_689710a9a73b7457_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_group_id_689710a9a73b7457_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permission_id_1f49ccbbdc69d2fc_fk_auth_permission_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permission_id_1f49ccbbdc69d2fc_fk_auth_permission_id FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user__permission_id_384b62483d7071f0_fk_auth_permission_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user__permission_id_384b62483d7071f0_fk_auth_permission_id FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups_group_id_33ac548dcf5f8e37_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_33ac548dcf5f8e37_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups_user_id_4b5ed4ffdb8fd9b0_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_4b5ed4ffdb8fd9b0_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permiss_user_id_7f0938558328534a_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permiss_user_id_7f0938558328534a_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: djan_content_type_id_697914295151027a_fk_django_content_type_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT djan_content_type_id_697914295151027a_fk_django_content_type_id FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log_user_id_52fdd58701c5f563_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: scoutmap
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_52fdd58701c5f563_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: public; Type: ACL; Schema: -; Owner: scoutmap
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM scoutmap;
GRANT ALL ON SCHEMA public TO scoutmap;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--


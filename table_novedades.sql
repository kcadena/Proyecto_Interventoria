/*

-- Sequence: public.novedades_id_novedad_seq

-- DROP SEQUENCE public.novedades_id_novedad_seq;

CREATE SEQUENCE public.novedades_id_novedad_seq
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 5
CACHE 1
CYCLE;

*/
--  Table: public.novedades

--  DROP TABLE public.novedades;

CREATE TABLE public.novedades
(
  id_novedad character varying NOT NULL primary key,
  keym bigint,
  id_caracteristica bigint,
  id_usuario bigint,
  tipo character varying(3),
  fecha_modificacion date,
  fecha_aprovacion date,
  nombre character varying,
  descripcion character varying,
  visto boolean,
  estado character varying(3)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.novedades
  OWNER TO postgres;

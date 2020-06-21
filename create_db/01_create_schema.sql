

DROP TABLE IF EXISTS public.users CASCADE ;

CREATE TABLE users (
    id SERIAL NOT NULL,
    username varchar(30) NOT NULL,
    password varchar(500) NOT NULL,
    submission_time timestamp without time zone
);


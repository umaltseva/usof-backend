create table if not exists users (
    id bigserial primary key,
    login varchar(128) not null unique,
    password varchar(128) not null,
    full_name varchar(256),
    email varchar(128) not null unique,
    profile_picture varchar(256) not null,
    rating bigint not null default 0,
    role varchar(32) not null default 'user',
    email_verified boolean not null default false
);

create table if not exists posts (
    id bigserial primary key,
    author_id bigint not null references users on delete cascade,
    title varchar(256) not null,
    publish_date timestamp not null default now(),
    status varchar(32) not null,
    content varchar(4096) not null
);

create table if not exists categories (
    id bigserial primary key,
    title varchar(256) not null unique,
    description varchar(1024)
);

create table if not exists post_categories (
    id bigserial primary key,
    post_id bigint not null references posts on delete cascade,
    category_id bigint not null references categories on delete cascade,
    unique(post_id, category_id)
);

create table if not exists comments (
    id bigserial primary key,
    post_id bigint not null references posts on delete cascade,
    author_id bigint not null references users on delete cascade,
    publish_date timestamp not null default now(),
    content varchar(4096) not null
);

create table if not exists likes (
    id bigserial primary key,
    author_id bigint not null references users on delete cascade,
    publish_date timestamp not null default now(),
    post_id bigint references posts on delete cascade,
    comment_id bigint references comments on delete cascade,
    type varchar(32) not null,
    unique(author_id, post_id, comment_id)
);

create table if not exists cancelled_tokens (
    id bigserial primary key,
    token varchar(1024) not null
);

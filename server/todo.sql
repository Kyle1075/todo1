-- Drop tables if they exist
drop table if exists task;
drop table if exists account;

-- Create account table
create table account(
    id serial primary key,
    email varchar(50) unique not null,
    password varchar(255) not null
);

-- Create task table
create table task(
    id serial primary key,
    description varchar(255) not null
);

-- Insert sample tasks
insert into task(description) values ('My new task');
insert into task(description) values ('My another test task');

from psycopg2.extras import RealDictCursor
import database_common
import bcrypt
import os


def random_api_key():
    """
    :return: salt in secret key
    """
    return os.urandom(100)


# query func verific daca username este deja in BD
@database_common.connection_handler
def username_exists(cursor: RealDictCursor, username: str):
    query = """
        SELECT *
        FROM users
        WHERE username = %(username)s;
         """
    args = {'username': username}
    cursor.execute(query, args)
    return cursor.fetchone()


# query func adaug username in DB
@database_common.connection_handler
def register_user(cursor: RealDictCursor, username: str, text_password: str, submission_time: int):
    """
    Checks for valid username.
    If username is valid, inserts the new user into the database
    """
    if username_exists(username):
        return False
    query = """
    INSERT INTO users (username,password,submission_time)
    VALUES (%(username)s,%(password)s,%(submission_time)s)
           """
    args = {"username": username, "password": encrypt_password(
        text_password), "submission_time": submission_time}
    return cursor.execute(query, args)


# func care transforma plain text password in hash salt pass
def encrypt_password(password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_pass = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_pass.decode('utf-8')


def verify_password(text_password, hashed_pass):
    return bcrypt.checkpw(text_password.encode('utf-8'), hashed_pass.encode('utf-8'))


@database_common.connection_handler
def users_data(cursor: RealDictCursor) -> list:
    query = """
        SELECT *
        FROM users
            """
    cursor.execute(query)
    return cursor.fetchall()


@database_common.connection_handler
def check_user(cursor, username):
    query = """
        SELECT id, password
        FROM users
        WHERE username ILIKE %(username)s;
    """
    args = {
        "username": username
    }
    cursor.execute(query, args)
    return cursor.fetchone()


@database_common.connection_handler
def votes(cursor: RealDictCursor) -> list:
    query = """
        SELECT *
        FROM planet_votes
            """
    cursor.execute(query)
    return cursor.fetchall()


@database_common.connection_handler
def vote_planet(cursor: RealDictCursor, planet_id: int, planet_name: str, user_id: int, submission_time: int) -> list:
    query = """
        INSERT INTO planet_votes (planet_id, planet_name, user_id, submission_time)
        VALUES (%(planet_id)s, %(planet_name)s, %(user_id)s, %(submission_time)s)
    """
    args = {'planet_id': planet_id, 'planet_name': planet_name, 'user_id': user_id, 'submission_time': submission_time}
    cursor.execute(query, args)


@database_common.connection_handler
def planets_votes(cursor: RealDictCursor, user_id: int) -> list:
    query = """
        SELECT pv.planet_name planet, COUNT(pv.planet_name) AS count, u.id, pv.user_id
        FROM planet_votes AS pv
        LEFT JOIN users u ON pv.user_id = u.id
        WHERE u.id = %(user_id)s
        GROUP BY planet, u.id, pv.user_id
    """
    args = {'user_id': user_id}
    cursor.execute(query, args)
    return cursor.fetchall()


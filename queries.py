import data_manager
import bcrypt
import os


def random_api_key():
    """
    :return: salt in secret key
    """
    return os.urandom(100)


def username_exists(username):
    return data_manager.execute_dml_statement('SELECT * FROM users WHERE username = %(username)s;',
                                              {'username': username})


def register_user(username, text_password, submission_time):
    if username_exists(username):
        return False
    return data_manager.execute_dml_statement('INSERT INTO users (username,password,submission_time) '
                                              'VALUES (%(username)s,%(password)s,%(submission_time)s)',
                                              {"username": username,
                                               "password": encrypt_password(text_password),
                                               "submission_time": submission_time})


def check_user(username):
    return data_manager.execute_dml_statement('SELECT id, password '
                                              'FROM users '
                                              'WHERE username '
                                              'ILIKE %(username)s;', {"username": username})


def encrypt_password(password):
    # By using bcrypt, the salt is saved into the hash itself
    hashed_pass = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed_pass.decode("utf-8")


def verify_password(text_password, hashed_pass):
    return bcrypt.checkpw(text_password.encode("utf-8"), hashed_pass.encode("utf-8"))


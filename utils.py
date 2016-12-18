from hashlib import sha1


def hash_pwd(password):
    return sha1(password).hexdigest()


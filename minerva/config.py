import os

if os.getenv('MINERVA_DIR'):
    ROOT_DIR = os.getenv('MINERVA_DIR')
else:
    ROOT_DIR = os.path.join(os.getenv('HOME'), '.minerva')

DATASET_DIR = os.path.join(ROOT_DIR, 'dataset')
DATABASE_PATH = os.path.join(ROOT_DIR, 'database.db')
MIGRATION_DIR = os.path.join(ROOT_DIR, 'migrations')
LOG_DIR = os.path.join(ROOT_DIR, 'train_logs')
TMP_DIR = '/tmp/minerva'
UPLOAD_DIR = '/tmp/minerva'

config = {
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///%s' % DATABASE_PATH,
    'SQLALCHEMY_TRACK_MODIFICATIONS': False,
    'MAX_CONTENT_LENGTH': 10 * 1024 * 1024 * 1024,
    'SEND_FILE_MAX_AGE_DEFAULT': 0
}


def prepare_directory():
    if not os.path.exists(ROOT_DIR):
        os.makedirs(ROOT_DIR)

    if not os.path.exists(DATASET_DIR):
        os.makedirs(DATASET_DIR)

    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)

    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)


def get_config(key):
    if key == 'ROOT_DIR':
        path = ROOT_DIR
    elif key == 'DATASET_DIR':
        path = DATASET_DIR
    elif key == 'DATABASE_PATH':
        path = DATABASE_PATH
    elif key == 'LOG_DIR':
        path = LOG_DIR
    elif key == 'TMP_DIR':
        path = TMP_DIR
    elif key == 'UPLOAD_DIR':
        path = UPLOAD_DIR
    elif key == 'MIGRATION_DIR':
        path = MIGRATION_DIR
    else:
        raise ValueError('invalid key value.')
    return path

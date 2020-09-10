from flask import request, jsonify
from sqlalchemy import desc


def update(cls, schema):
    def _func(model_id):
        model = cls.get(model_id, raise_404=True)
        json_data = request.get_json()
        model.name = json_data['name']
        model.update()
        return jsonify(schema().dump(model))

    return _func


def get_all(cls, schema):
    def _func():
        models = cls.create_query().order_by(desc(cls.id)).all()
        model_schema = schema(many=True)
        return jsonify({
            cls.__name__.lower() + 's': model_schema.dump(models),
            'total': len(models)
        })

    return _func


def get(cls, schema):
    def _func(model_id):
        model = cls.get(model_id, raise_404=True)
        return jsonify(schema().dump(model))

    return _func


def delete(cls):
    def _func(model_id):
        model = cls.get(model_id, raise_404=True)
        model.delete()
        return jsonify({})

    return _func


def generate_for_model(app, cls, schema):
    # get all endpoint
    app.add_url_rule('/', 'get_all', get_all(cls, schema), methods=['GET'])

    # get endpoint
    app.add_url_rule('/<model_id>', 'get', get(cls, schema), methods=['GET'])

    # update endpoint
    app.add_url_rule('/<model_id>',
                     'update',
                     update(cls, schema),
                     methods=['PUT'])

    # delete endpoint
    app.add_url_rule('/<model_id>', 'delete', delete(cls), methods=['DELETE'])

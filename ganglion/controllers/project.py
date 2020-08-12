from flask import Blueprint, request, jsonify
from sqlalchemy import desc
from ..database import db
from ..models.project import Project, ProjectSchema

project_route = Blueprint('project', __name__)


@project_route.route('/', methods=['GET'])
def get_all_projects():
    projects = db.session.query(Project)\
        .order_by(desc(Project.id))\
        .all()

    project_schema = ProjectSchema(many=True)
    return jsonify({
        'projects': project_schema.dump(projects),
        'total': len(projects)
    })


@project_route.route('/', methods=['POST'])
def create_project():
    json = request.get_json()
    dataset_id = json['dataset_id']
    name = json['name']
    project = Project.create(dataset_id, name, 'cql')
    return jsonify(ProjectSchema().dump(project))


@project_route.route('/<project_id>', methods=['GET'])
def get_project(project_id):
    project = Project.get(project_id, raise_404=True)
    return jsonify(ProjectSchema().dump(project))


@project_route.route('/<project_id>', methods=['PUT'])
def update_project(project_id):
    project = Project.get(project_id, raise_404=True)
    json = request.get_json()
    project.name = json['name']
    db.session.commit()
    return jsonify(ProjectSchema().dump(project))


@project_route.route('/<project_id>', methods=['DELETE'])
def delete_project(project_id):
    project = Project.get(project_id, raise_404=True)
    project.delete()
    return jsonify({})

const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
	id: {type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true},
	fullName: {type: DataTypes.STRING, allowNull: false},
	email: {type: DataTypes.STRING, unique: true, allowNull: false},
	password: {type: DataTypes.STRING, allowNull: false},
	image: {type: DataTypes.STRING},
	role: {type: DataTypes.STRING, defaultValue: "TEACHER"},
})

const Lesson = sequelize.define('lesson', {
	id: {type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true},
	name: {type: DataTypes.STRING, allowNull: false},
	annotationLink: {type: DataTypes.STRING, allowNull: false},
})

const Materials = sequelize.define('materials', {
	id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	name: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('type', {
	id: {type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true},
	name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Specialty = sequelize.define('specialty', {
	id: {type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true},
	name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Course = sequelize.define('course', {
	id: {type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true},
	number: {type: DataTypes.SMALLINT, unique: true, allowNull: false},
})

const Links = sequelize.define('links', {
	id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	presLink: {type: DataTypes.STRING},
	docLink: {type: DataTypes.STRING},
	videoLink: {type: DataTypes.STRING},
})

User.hasMany(Lesson)
Lesson.belongsTo(User)

Specialty.hasMany(Lesson)
Lesson.belongsTo(Specialty)

Course.hasMany(Lesson)
Lesson.belongsTo(Course)

Type.hasMany(Materials)
Materials.belongsTo(Type)

Lesson.hasMany(Materials)
Materials.belongsTo(Lesson)

Materials.hasOne(Links, {foreignKey: 'materialId', as: 'info'})
Links.belongsTo(Materials, {foreignKey: 'materialId'})

module.exports = {
	User,
	Lesson,
	Materials,
	Type,
	Specialty,
	Course,
	Links
}
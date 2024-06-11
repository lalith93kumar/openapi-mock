Feature: Open mock api

	Scenario Outline: validate mock api
		#Given Build the image
		When Docker start the container with config file '<config_file>'
		And trigger '<method>' request to endpoint as '<url>' with status code '<statuscode>'
		Then validate '<method>' Response with '<statuscode>' schema for path '<endpoint>' from file config as '<config_file>'
	
	Examples: 
    | statuscode | endpoint | method | config_file| url|
    | 200 | /pets | GET | petstore.yaml| /pets |
	| 200 | /pets/{petId} | GET | petstore.yaml| /pets/1234|
	| 200 | /persons | GET | persons.yaml| /persons |
	| 200 | /persons/{personId} | GET | persons.yaml| /persons/1234|
    | 200 | /pets | GET | petstore.yaml| /pets |
	| 200 | /pets/{petId} | GET | petstore.yaml| /pets/1234|
	| 200 | /persons | GET | persons.yaml| /persons |
	| 200 | /persons/{personId} | GET | persons.yaml| /persons/1234|

	Scenario Outline: validate mock api post & put
		#Given Build the image
		When Docker start the container with config file '<config_file>'
		And trigger '<method>' request to endpoint as '<endpoint>' with status code '<statuscode>' & schema from file config as '<config_file>' -> '<url>'
		Then validate '<method>' Response with '<statuscode>' schema for path '<endpoint>' from file config as '<config_file>'
	
	Examples: 
    | statuscode | endpoint | method | config_file| url|
    | 201 | /pets | POST | petstore.yaml| /pets |
	| 201 | /pets/{petId} | PUT | petstore.yaml| /pets/1234 |
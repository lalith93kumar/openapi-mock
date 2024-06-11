import { Given, When, Then, And, After} from 'cypress-cucumber-preprocessor/steps';
const YAML = require('yamljs')
const Validator = require('jsonschema').Validator;
const v = new Validator();
Given('Build the image', () => {
  cy.exec('cd .. && docker buildx build -f Dockerfile --platform linux/amd64 --tag my-container:latest --load .',{ timeout: 540000, failOnNonZeroExit:false }).then((result) => {
    cy.log(result.stderr + result.stdout)
    expect(result.code).to.eq(0)
  })
});

When('Docker start the container with config file {string}', (configFile) => {
  cy.exec('docker run -v ${PWD}/cypress/fixtures:/etc/openapi -p 8080:8080 -e "OPENAPI_MOCK_SPECIFICATION_URL=/etc/openapi/'+configFile+'" -d my-container',{ timeout: 540000, failOnNonZeroExit:false }).then((result) => {
    cy.log(result.stderr + result.stdout)
    expect(result.code).to.eq(0)
  })
});

And("trigger {string} request to endpoint as {string} with status code {string}", (method,endpoint,statuscode) => {
  cy.request(method,endpoint).then((response) =>{
    expect(response.status).to.eq(parseInt(statuscode))
    cy.wrap(response).as("Data_to_Validate")
  })
});


And("trigger {string} request to endpoint as {string} with status code {string} & schema from file config as {string} -> {string}", (method,endpoint,statuscode,confileFile,url) => {
  cy.fixture(confileFile).then((data) =>{
    var sidebar = YAML.parse(data);
    cy.task('getRef',sidebar).then((value) => {
      var schema = value['resolved']['paths'][endpoint][method.toLowerCase()]['requestBody']['content']['application/json']['schema']
      cy.task('getFakeBody',schema).then((body) => {
        cy.request(method,url,body).then((response) =>{
          expect(response.status).to.eq(parseInt(statuscode))
          cy.wrap(response).as("Data_to_Validate")
        })
      })
    })
  })
});

Then('validate {string} Response with {string} schema for path {string} from file config as {string}', (method,statuscode,endpoint,confileFile) => {
  cy.fixture(confileFile).then((data) =>{
    var sidebar = YAML.parse(data);
    cy.task('getRef',sidebar).then((value) => {
      cy.get('@Data_to_Validate').then((response)=>{
        if(response.hasOwnProperty('body')) {
          var schema = value['resolved']['paths'][endpoint][method.toLowerCase()]['responses'][statuscode]['content']['application/json']['schema']
          var res = v.validate(response.body,schema)
          if(res.errors.length!=0)
          {
            cy.log(res.errors)
          }
          expect(res.valid).to.eq(true)
        }
      })
    })
  })
});

After(() => {
  cy.exec('docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)',{ timeout: 540000, failOnNonZeroExit:false }).then((result) => {
    cy.log(result.stderr + result.stdout)
  })
})

Then('Delete all container', () => {

});
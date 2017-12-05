rm lambda.zip
cd lambda
npm install
zip -r ../lambda.zip *
cd ..
aws lambda update-function-code --function-name voice-devs --zip-file fileb://lambda.zip --profile oscar-eu-west-1

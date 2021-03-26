const { S3Client } = require("@aws-sdk/client-s3");

const BUCKET = "dnd-app-storage";
const BUCKET_CONFIG = {Bucket: BUCKET};
const CONFIG = {
	// creds to be supplied through AWS env vars
	region: "us-east-1",
	output: "json"
};

let s3 = new S3Client(CONFIG);

// const testFunc = async () => {
// 	console.log("called");
// 	let res = await s3.send(new ListObjectsCommand(BUCKET_CONFIG));
// 	console.log("hi", res);
// }

// testFunc();

module.exports = {
	s3: s3,
	bucketName: BUCKET,
	bucketConf: BUCKET_CONFIG
};
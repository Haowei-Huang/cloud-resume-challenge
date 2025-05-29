import json
import boto3
import logging
from decimal import Decimal
from botocore.exceptions import ClientError
import os
# getting the dynamoDB resource
dynamoDB = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
primary_key = os.environ['PRIMARY_KEY']
access_control_allow_origin = os.environ['ACCESS_CONTROL_ALLOW_ORIGIN']

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# load table, if not exists, create it
def load_table(table_name):
    try:
        table = dynamoDB.Table(table_name)
        table.load()
    except ClientError as err:
        # create table
        if err.response["Error"]["Code"] == "ResourceNotFoundException":
            table = create_table(table_name)
            logger.error(
                "Resource not found for table %s. Here's why: %s: %s", table_name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
        else:
            logger.error(
                "Couldn't check for existence of table %s. Here's why: %s: %s", table_name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
    return table

def create_table(table_name):
    try:
        table = dynamoDB.create_table(
            TableName=table_name,
            KeySchema=[
                {
                    "AttributeName": primary_key, "KeyType":"HASH"
                }
            ],
            AttributeDefinitions=[
                {
                    "AttributeName": primary_key, "AttributeType":"S"
                }
            ],
            BillingMode="PAY_PER_REQUEST"
        )
        table.wait_until_exists()
    except ClientError as err:
            logger.error(
                "Couldn't create table %s. Here's why: %s: %s", table_name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise

table = load_table(table_name)

def lambda_handler(event, context):
    user_ip = event['requestContext']['identity']['sourceIp'] # retrieved from the TCP connection
    logger.info("Visitor IP Address: " + user_ip + " is accessing the website.")
    add_ip_address(user_ip)
    print("current item count (notice that this value updates every 6 hours)" + str(table.item_count))
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': access_control_allow_origin # your subdomain
        },
        'body': json.dumps({"item_count": table.item_count})
    }

def add_ip_address(ip_address):
    try:
        response = table.put_item(
            Item={
                primary_key: str(hash(ip_address))
            }, # put hashed ip address
            
        )
        
    except ClientError as err:
        logger.error(
            "Couldn't update record in table %s. Here's why: %s: %s",
            table_name,
            err.response["Error"]["Code"],
            err.response["Error"]["Message"],
        )
        raise
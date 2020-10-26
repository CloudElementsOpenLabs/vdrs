# Using isWhere in a VDR
This is an example of using the where clause in a VDR when the search term is different from the original object (in a GET request, this would mean the vendor field in a VDR). The example VDR uses Netsuite ERP's ledgerAccount object. Although mapping `account_type` to Netsuite's `acctType.value` yields the correct results when executing a GET request without a where clause, it does not work with a where clause because Netsuite is expecting the search term `type` to search for the field `acctType.value`. Using custom javascript in a VDR can transform the where clause as well, so that you can query `account_type='_bank'` and receive the correct results.

## **NOTES:**
* This VDR was created to work with Netsuite ERP, so you need to have an authenticated instance of this Element if you plan to test with this example. Otherwise, you will need to update the javacript to accomdate your specific use-case.
* If you just want the script to play with in your own VDR, it is in the main directory: [isWhereVDRScript.js](isWhereVDRScript.js).
* You **MUST** have the `Apply Scripts on Query Field Value` toggled to true in order for the script to apply to the where clause. You can find this setting by clicking the gear wheel icon next to the `DELETE TANSFORMATION` button.

## Importing the VDR and transformation
There are two ways to import the VDRs and transformations. You can use the UI (API docs) or Cloud Element's cli tool, the doctor.

### Import in the UI
1. Create the VDRs.
    * Create the VDR by calling POST `/organizations/objects/ledgerAccount/definitions` with this payload: [objectDefinition.json](ledgerAccount/definition/objectDefinition.json), where the objectName is `ledgerAccount`. You can find this API [here](https://my-staging.cloudelements.io/api-docs/platform/organizations).
2. Create the transformation for Netsuite ERP.
    * Create the transformation for Netsuite by calling POST `/organizations/elements/netsuiteerpv2/transformations/{objectName}` [here](https://my-staging.cloudelements.io/api-docs/platform/organizations), where the keyOrId is `netsuiteerpv2` and the objectName is `ledgerAccount`: [transformation.json](ledgerAccount/transformation/netsuiteerpv2/transformation.json)
3. You can now move on to the section below, **Code Explanation**.

### Import using the doctor
1. Ensure you have the correct version of the doctor installed locally. Run the command:
    ```
    npm i -g ce-util
    ```
    This will install the latest, non-beta version of the doctor. You can find full instructions [here](https://www.npmjs.com/package/ce-util) as well, as you might need to add an account if you are not already familiar with the doctor. 
2. Import the VDR and transformation.
    * In the terminal, cd into the `UsingIsWhere` directory, then, from that directory, run the following three command:
        ```
        doctor upload vdrs <accountNickName> -n ledgerAccount -d .
        ```
    * This will import VDR as well as the transformation and custom JS into the account you specify.
    * **Note**: If you make changes the the VDR and want to save them locally, you can run `doctor download vdrs <accountsNickName> -n nameOfVDRinUI -d .` from your terminal to do so. This command will save your VDR to a directory with the same name as your VDR. You can alternatively specify your own directory name instead of the `.` after the `d` flag.
3. You can now move on to the section below, **Code Explanation**.

## Code Explanation
In the parent VDR (`my-contacts`), the JS will call the other two VDRs (`my-contact-activities` and `my-contact-notes`) and concatenate the results into one response. Make a `GET` request using the `Try It Out` feature in the VDR UI. You can cut and re-paste the JS as well to see how the returned results differ with and without it.
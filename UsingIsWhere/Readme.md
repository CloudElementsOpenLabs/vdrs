# Using isWhere in a VDR
This is an example of using the where clause in a VDR when the search term is different from the original object (in a GET request, this would mean the vendor field in a VDR). The example VDR uses Netsuite ERP's ledgerAccount object. Although mapping `account_type` to Netsuite's `acctType.value` yields the correct results when executing a GET request without a where clause, it does not work with a where clause because Netsuite is expecting the search term `type` to search for the field `acctType.value`. Using custom javascript in a VDR can transform the where clause as well, so that you can query `account_type='_bank'` and receive the correct results.

The use-case in this example is only one of many that demonstrate how you can use `isWhere` in VDRs to modify the contents of a where clause. It's not limited to cases where the search term needs to change, as the above example is showing.

## **NOTES:**
* This VDR was created to work with Netsuite ERP, so you need to have an authenticated instance of this Element if you plan to test with this example. Otherwise, you will need to update the javacript to accomdate your specific use-case.
* If you just want the script to play with in your own VDR, it is in the main directory: [isWhereVDRScript.js](isWhereVDRScript.js).
* You **MUST** have the `Apply Scripts on Query Field Value` toggled to true in order for the script to apply to the where clause. You can find this setting by clicking the gear wheel icon next to the `DELETE TRANSFORMATION` button.

## Importing the VDR and transformation
There are two ways to import the VDRs and transformations. You can use the UI (API docs) or Cloud Element's cli tool, the doctor.

### Import in the UI
1. Create the VDRs.
    * Create the VDR by calling POST `/organizations/objects/ledgerAccount/definitions` with this payload: [objectDefinition.json](ledgerAccount/definition/objectDefinition.json), where the objectName is `ledgerAccount`. You can find this API [here](https://my-staging.cloudelements.io/api-docs/platform/organizations).
2. Create the transformation for Netsuite ERP.
    * Create the transformation for Netsuite by calling POST `/organizations/elements/netsuiteerpv2/transformations/{objectName}` [here](https://my-staging.cloudelements.io/api-docs/platform/organizations), where the keyOrId is `netsuiteerpv2` and the objectName is `ledgerAccount`: [transformation.json](ledgerAccount/transformation/netsuiteerpv2/transformation.json)
3. You can now move on to the section below, [Code Explanation](#code-explanation).

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
3. You can now move on to the section below, [Code Explanation](#code-explanation).

## <a name="code-explanation"></a>Code Explanation
The javascript in the VDR will show a simple example of using the `isWhere` option.
```
if (isWhere) {
    const queries = originalObject.where.map(q => {
        if (q.attribute == 'account_type') q.attribute = 'type';
        return q;
    });
    transformedObject.where = queries;
}

done(transformedObject);
```
This simple function is converting the input of `account_type` to `type` (what Netsuite is expecting) and then returning it as the `transformedObject's` where clause. There are many
more  use-cases for this functionality but we've provided this example as a jumping-off point.
## Following are the updates done to ensure payment jobs are handled using Mongo transactions and fix the always 200 syntax error on 'createBill' controller.

1. Added zod for body parsing to ensure right and ethical data types.

### Create Bill Controller
1. For 'createBill', the mapping was not awaited hence it was not an asynchronous operation. Could say this is an example similar to a 'race conditon'. Once wrapped in promise, it is fixed.

### Payment Jobs
1. Idea was to not use map and keep it simple. 
2. Referred to repos on Github to learn, understand & fix Mongo sessions and transactions.
3. Firstly, we check if all the 'pending' bills are existing and linked to that user.
4. Then in a single query, we update all the bills status to 'processing'.
5. We add the total of all 'amount' of all the bills together to then check if the user has sufficient or valid 'balance'.
6. If all conditions are met, we commit the transaction and mark the statuses as 'paid'.
7. Incase any of the steps goes wrong or breaks, it is immediately thrown an error and caught in the catch block where we 'abortTransaction' and 'endSession'.
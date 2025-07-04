## Following are the changes done to do the operation using in-memory queue[a variable array] compared to the 'main' branch.

1. Added zod for body parsing to ensure right and ethical data types.
2. Once the payment api is hit, we parse and then we send the body to the queue.
3. The DB transactions that we do directly in 'main' branch is now in a function called 'processPaymentJob'.
4. Then we have two others function, one is 'enqueuePaymentJob', which we use in the controller to push the job to the queue.
5. Then we have 'processQueue'. This is a recursive function that calls the 'processPaymentJob' function, one by one.
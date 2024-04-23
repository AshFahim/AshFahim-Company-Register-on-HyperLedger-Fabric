#!/bin/bash

# Execute networkDown.sh
./networkDown.sh

# Check if networkDown.sh executed successfully
if [ $? -eq 0 ]; then
    echo "networkDown.sh executed successfully."

    # Execute startFabric.sh with argument 'javascript'
    ./startFabric.sh javascript

    # Check if startFabric.sh executed successfully
    if [ $? -eq 0 ]; then
        echo "startFabric.sh executed successfully."

        # Change directory to 'javascript'
        cd javascript

        # Execute enrollAdmin.js
        echo "Executing enrollAdmin.js..."
        node enrollAdmin.js

        # Execute registerUser.js
        echo "Executing registerUser.js..."
        node registerUser.js

        # Execute npm start
        echo "Executing npm start..."
        npm start

    else
        echo "Error: startFabric.sh failed to execute."
    fi

else
    echo "Error: networkDown.sh failed to execute."
fi

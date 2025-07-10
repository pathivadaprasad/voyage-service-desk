trigger ClosedOpportunityTrigger on Opportunity (after insert, after update) {
    List<Task> tasksToInsert = new List<Task>();

    for (Opportunity opp : Trigger.new) {
        // Check if Opportunity is Closed Won and was either just inserted or its stage changed to Closed Won
        if (opp.StageName == 'Closed Won') {
            // In after update, make sure the stage actually changed
            if (Trigger.isInsert || 
               (Trigger.isUpdate && Trigger.oldMap.get(opp.Id).StageName != 'Closed Won')) {

                Task followUpTask = new Task(
                    Subject = 'Follow Up Test Task',
                    WhatId = opp.Id
                );
                tasksToInsert.add(followUpTask);
            }
        }
    }

    // Insert all tasks at once — BULKIFIED
    if (!tasksToInsert.isEmpty()) {
        insert tasksToInsert;
    }
}

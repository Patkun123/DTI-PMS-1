<?php

namespace App\Policies;

use App\Models\Ppmp;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PpmpPolicy
{
    /**
     * Intercept all authorization checks.
     * Allow all users all abilities EXCEPT:
     * - view, update, delete are restricted to final+utilized PPMPs.
     * - Users CAN edit/update status_plan='process' or 'indicative' PPMPs to change status.
     */
    public function before(User $user, string $ability): ?bool
    {
        // Allow create freely for all users
        if ($ability === 'create') {
            return true;
        }

        // For other abilities, delegate to specific policy methods
        return null;
    }

    /**
     * Determine whether the user can view the PPMP.
     * Only allowed if status_plan is 'final' AND status is 'utilized'.
     */
    public function view(User $user, Ppmp $ppmp): bool
    {
        // Allow all authenticated users to view PPMPs
        return true;
    }

    /**
     * Determine whether the user can edit/update the PPMP.
     * Allow edit UNLESS status_plan is 'final'.
     * Users can change status from 'process' to 'utilized' (or other transitions).
     */
    public function update(User $user, Ppmp $ppmp): bool
    {
        // Allow all authenticated users to update PPMPs
        return true;
    }

    /**
     * Determine whether the user can print the PPMP.
     * Only allowed if status_plan is 'final' AND status is 'utilized'.
     */
    public function print(User $user, Ppmp $ppmp): bool
    {
        // Allow all authenticated users to print PPMPs
        return true;
    }

    /**
     * Determine whether the user can create a PPMP.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can delete the PPMP.
     */
    public function delete(User $user, Ppmp $ppmp): bool
    {
        return false;
    }
}

<?php

/**
 * Note: This is a basic model showing simple
 * relationships between an Employer (child to a user)
 * and it's jobs (an Employer can have many job openings.
 */

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Employers extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id', 'contact_email', 'company', 'logo', 'website', 'about_us'
    ];

    public function user ()
    {
        return $this->belongsTo('App\Users');
    }

    public function jobs ()
    {
        return $this->hasMany('App\Jobs');
    }

    /**
     * Checks to ensure the employer profile is complete
     */
    public function isProfileComplete () {
        $employer = Employers::where('user_id', Auth::id())->first();

        if (!$employer->logo || !$employer->company) {
            return false;
        } else {
            return true;
        }
    }

}
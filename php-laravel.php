<?php
/**
 * Store a newly Job Opening in jobboard.jobs
 *
 * @param  \Illuminate\Http\Request  $request
 */

public function store(Request $request)
{

    //Load the employer profile for the logged in user.
    $employer = Employers::where('user_id', Auth::id())->first();

    //Check if we have maxed out the number of openings we can have
    if ($this->activeJobCount($employer->id) >= $employer->max_listings) {

        return response()->json(['limit_reached' => true], 422);
    } else {

        $job = new Jobs();
        $job->employers_id      = $employer->id;
        $job->title             = $request->get('title');
        $job->description       = $request->get('description');
        $job->pay               = $request->get('pay'); //$65 hr, 50,000 year (any format)
        $job->type              = $request->get('type'); //front-end, back-end, etc
        $job->location          = $request->get('location');
        $job->category_id       = $request->get('category');
        $job->apply_link        = $request->get('apply_link'); //link on employer's site to apply
        $job->active            = ;
        $job->save();

        //Return JSON response of a success
        return response()->json(null, 200);
    }
}

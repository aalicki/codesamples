<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use mysql_xdevapi\Exception;
use Session, Redirect;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

use App\Employers;

class MainController extends Controller
{

    //Set our image path to attach to an uploaded image
    private $imagePath = '/image/employers/';
    private $employerID;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Update Job
     *
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function update(Request $request, $id, $employerID)
    {

        // Get the employer information (to ensure we have ownership)
        $employer = Employers::where('user_id', $employerID)->first();

        // Set our employer ID
        $this->employerID = $employer->id;

        try {

            //Get the job, if possible
            $job = Jobs::where('employers_id', $employer->id)->where('id', $id)->first();

            $job->title             = $request->get('title');
            $job->description       = $request->get('description');
            $job->pay               = $request->get('pay');
            $job->type              = $request->get('type');
            $job->active            = $request->get('active');

            // Check if a profile image has been uploaded
            if ($request->has('logo')) {
                $this->processImage($request, $employer);
            }

            $job->save();

            // Set our result array, indicate success
            $results[] = [
                'status' => 'success'
            ];

            $status = 200;

        } catch (Exception $e) {

            // Set our result array, indicate failure
            $results[] = [
                'status'    => 'failure',
                'msg'       => $e
            ];

            $status = 400;
        }

        // Return a JSON response and payload
        return response()->json($results, $status);
    }

    private function processImage ($request, $employer) {

        //Get the logo image from the form.
        $image = $request->file('logo');

        $extension  = $image->getClientOriginalExtension();
        $logoName   = $this->employerID . '.' . $extension;
        $filePath   = $this->imagePath . $logoName;

        // Resize image to fit our UI
        $img = Image::make($image)->resize(500, null, function ($constraint) {
            $constraint->aspectRatio();
        })->encode($extension);

        //Save image to S3 Bucket
        Storage::disk('s3')->put($filePath, (string)$img, 'public');

        // Set our employer logo
        return $employer->logo = env('AWS_BUCKET_PATH') . $logoName;
    }

}

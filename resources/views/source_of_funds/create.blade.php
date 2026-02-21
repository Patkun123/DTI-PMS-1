<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Create Source of Fund</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>body{padding:20px}</style>
</head>
<body>
    <div class="container">
        <h1>Create Source of Fund</h1>
        <form action="{{ route('source-of-funds.store') }}" method="POST">
            @csrf
            @include('source_of_funds.form')
            <button class="btn btn-primary">Save</button>
            <a class="btn btn-secondary" href="{{ route('source-of-funds.index') }}">Back</a>
        </form>
    </div>
</body>
</html>

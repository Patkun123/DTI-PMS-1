<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Source of Funds</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>body{padding:20px}</style>
</head>
<body>
    <div class="container">
        <h1>Source of Funds</h1>
        <a class="btn btn-primary mb-3" href="{{ route('source-of-funds.create') }}">Add Source of Fund</a>

        <form method="GET" class="mb-3">
            <div class="row g-2 align-items-center">
                <div class="col-auto">
                    <select name="division" class="form-select">
                        <option value="">All divisions</option>
                        @foreach($divisions as $d)
                            <option value="{{ $d }}" {{ request('division') == $d ? 'selected' : '' }}>{{ $d }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="col-auto">
                    <button class="btn btn-secondary">Filter</button>
                </div>
            </div>
        </form>

        @if(session('success')) <div class="alert alert-success">{{ session('success') }}</div> @endif

        <table class="table table-bordered">
            <thead>
                <tr><th>#</th><th>Name</th><th>Division</th><th>Description</th><th>Actions</th></tr>
            </thead>
            <tbody>
            @foreach($items as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->division ?? '-' }}</td>
                    <td>{{ \Illuminate\Support\Str::limit($item->description, 80) }}</td>
                    <td>
                        <a class="btn btn-sm btn-secondary" href="{{ route('source-of-funds.edit', $item) }}">Edit</a>
                        <form action="{{ route('source-of-funds.destroy', $item) }}" method="POST" style="display:inline" onsubmit="return confirm('Delete?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-danger">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>

        {{ $items->withQueryString()->links() }}
    </div>
</body>
</html>
